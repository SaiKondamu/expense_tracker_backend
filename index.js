const express = require('express');
const jsforce = require('jsforce');
const {PORT, APP_URL} = require('./src/config.js');
const cors = require('cors');
const app = express();

const authController = require('./src/controllers/authController.js');
const expenseController = require('./src/controllers/expenseController.js');

const port = PORT || 3002;  

const allowedOrigins = [APP_URL]; // Add your frontend URL here

app.use(cors({
  origin: allowedOrigins, // Adjust this to your frontend URL
}));

app.get('/test', (req, res) => {
  //res.send('Hello World!');
    res.json({ success: true, message: 'Hello World!' });
});

// app.get('/connection', async (req, res) => {
//     const conn = new jsforce.Connection({
//     // you can change loginUrl to connect to sandbox or prerelease env.
//         loginUrl : salesforce.loginUrl
//     });

//     const username = salesforce.username || 'your_salesforce_username';
//     const password = salesforce.password || 'your_salesforce_password';

//     console.log(`Logging in with username: ${username}`);      
//     console.log(`Using password: ${password}`); // Be cautious with logging sensitive information
//     const userInfo = await conn.login(username, password)

//     // logged in user property
//     console.log(`access token is ${conn.accessToken}`);
//     console.log(`instance URL is ${conn.instanceUrl}`);
//     console.log("User ID: " + userInfo.id);
//     console.log("Org ID: " + userInfo.organizationId);

// });

app.use('/oauth2', authController);
app.use('/expenses', expenseController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
