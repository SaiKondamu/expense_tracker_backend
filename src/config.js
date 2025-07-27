const dotenv = require('dotenv').config();

module.exports = {
  salesforce: {
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI,
    username: process.env.SALESFORCE_USERNAME,
    password: process.env.SALESFORCE_PASSWORD,
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN,
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
  },
  server: {
    port: process.env.PORT || 3002,
    url: process.env.SERVER_URL || 'http://localhost:3002',
    app_url : process.env.APP_URL || 'http://localhost:3000',
  },
};