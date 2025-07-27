const express = require('express');
const router = express.Router();
const { login, callback, whoAmI, logout } = require('../services/salesforceService.js'); // Assuming you have a service to handle Salesforce logic


router.get('/login', login);
router.get('/callback', callback); // Assuming you have a callback method in your service
router.get('/whoami', whoAmI)
router.get('/logout', logout);

module.exports = router;