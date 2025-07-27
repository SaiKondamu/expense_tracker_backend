const express = require('express');
const router = express.Router();
const { queryExpenses } = require('../services/expenseService.js'); // Assuming you have a service to handle Salesforce logic


router.get('/', queryExpenses);

module.exports = router;