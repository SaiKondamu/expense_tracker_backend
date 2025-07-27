const jsforce  = require('jsforce');

const { SF_Login_URL, SF_Client_ID, SF_Client_Secret, SF_Callback_URL, APP_URL} = require('../config.js'); 

const LocalStorage = require('node-localstorage').LocalStorage;
const lcStorage = new LocalStorage('./info');

const oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl : SF_Login_URL,
  clientId : SF_Client_ID,
  clientSecret : SF_Client_Secret,
  redirectUri : SF_Callback_URL
});

const login = (req, res) => {
    
    console.log(`Redirecting to Salesforce login with clientId: ${oauth2.clientId}`);
    console.log(`Redirecting to Salesforce login with clientSecret: ${oauth2.clientSecret}`);
    console.log(`Redirecting to Salesforce login with redirectUri: ${oauth2.redirectUri}`);
    try{
        res.redirect(oauth2.getAuthorizationUrl({ scope : 'full refresh_token' }));
    }catch (error) {
        console.error('Error during login:', error);
        //return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const callback = async (req, res) => {
    const {code} = req.query;
    if(!code){
        console.error('No code provided in callback');
        return res.status(500).send('No code provided in callback');
    }
    console.log(`Received code: ${code}`);

    const conn = new jsforce.Connection({ oauth2 : oauth2 });
    const userInfo = await conn.authorize(code);

    lcStorage.setItem('accessToken', conn.accessToken);
    lcStorage.setItem('refreshToken', conn.refreshToken);
    lcStorage.setItem('instanceUrl', conn.instanceUrl);
    console.log(lcStorage.getItem('accessToken'));
    console.log(`Refresh token: ${conn.refreshToken}`);
    console.log(`Instance URL: ${conn.instanceUrl}`);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    //res.send('Authorization successful! You can close this window now.');
    // You can redirect to a success page or send a response
    res.redirect(APP_URL); // Adjust the redirect as needed
}

const createConnection = (res) => {
    const accessToken = lcStorage.getItem('accessToken');
    const instanceUrl = lcStorage.getItem('instanceUrl');
    if (!accessToken || !instanceUrl) {
        console.error('No access token or instance URL found in local storage');
        return res.status(200).send('Unauthorized: No access token or instance URL found');
    }
    return new jsforce.Connection({ 
        instanceUrl: instanceUrl,
        accessToken: accessToken
    });
}

//function to get logged in user details
const whoAmI = async(req, res) => {
    console.log('Fetching user identity...');
    const conn = createConnection(res);
    try{
        const identity = await conn.identity();
        console.log('User ID:', identity.user_id);
        console.log('Org ID:', identity.organization_id);
        res.json(identity);
    }catch (error) {
        console.error('Error during identity fetch:', error);
        handleSalesforceError(error, res);
        return;
    }
}

const handleSalesforceError = (error, res) => {
    console.log('Handling Salesforce error:', JSON.stringify(error));
    if(/*error.statusCode === 404 && (error.code === 'NOT_FOUND' || */error.errorCode === 'INVALID_SESSION_ID') {
        console.error('Session expired or not found. Redirecting to login.');
        lcStorage.clear(); // Clear local storage
        res.status(200).send({});
    }else{
        console.error('Salesforce error:', error);
        res.status(error.statusCode || 500).send({
            error: 'Salesforce API Error',
            message: error.message || 'An unexpected error occurred'
        });
    }
}

const logout = (req, res) => {
    console.log('Logging out...');
    lcStorage.clear(); // Clear local storage
    console.log('Local storage cleared. Redirecting to login page.');
    res.redirect(`${APP_URL}/login`); // Adjust the redirect as needed
}
module.exports = {login, callback, whoAmI, logout};