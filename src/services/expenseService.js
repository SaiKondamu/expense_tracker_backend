const jsforce  = require('jsforce');

const { SF_Login_URL, SF_Client_ID, SF_Client_Secret, SF_Callback_URL} = require('../config.js'); 

const LocalStorage = require('node-localstorage').LocalStorage;
const lcStorage = new LocalStorage('./info');

const queryExpenses = async (req, res) => {

    let accessToken = lcStorage.getItem('accessToken');
    if (!accessToken) {
        console.error('No access token found. Redirecting to login.');
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    const conn = new jsforce.Connection({
        oauth2: {
            loginUrl: SF_Login_URL,
            clientId : SF_Client_ID,
            clientSecret : SF_Client_Secret,
            redirectUri : SF_Callback_URL
        },
        accessToken: lcStorage.getItem('accessToken'),
        instanceUrl: lcStorage.getItem('instanceUrl')
    });

    try {
        const expenses = await conn.query("SELECT Id, Name, Expense_Name__c, Amount__c, Category__c, Date__c, Notes__c FROM Expense__c ORDER BY Date__c DESC");
        console.log('Expenses fetched successfully:', JSON.stringify(expenses));
        res.json(expenses.records);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        handleSalesforceError(error, res);
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

module.exports = { queryExpenses };