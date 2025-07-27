const jsforce  = require('jsforce');

const { salesforce, server } = require('../config.js'); 

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
            loginUrl: salesforce.loginUrl,
            clientId: salesforce.clientId,
            clientSecret: salesforce.clientSecret,
            redirectUri: salesforce.redirectUri
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

module.exports = { queryExpenses };