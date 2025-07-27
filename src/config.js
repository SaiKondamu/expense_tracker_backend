const dotenv = require('dotenv').config();

module.exports = {
    SF_Client_ID: process.env.SALESFORCE_CLIENT_ID,
    SF_Client_Secret: process.env.SALESFORCE_CLIENT_SECRET,
    SF_Callback_URL: process.env.SALESFORCE_REDIRECT_URI,
    username: process.env.SALESFORCE_USERNAME,
    password: process.env.SALESFORCE_PASSWORD,
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN,
    SF_Login_URL: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    PORT : process.env.PORT || 3002,
    url: process.env.SERVER_URL || 'http://localhost:3002',
    APP_URL : process.env.APP_URL || 'http://localhost:3000',
};