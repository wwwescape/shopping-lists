// server/src/routes/test.js

const express = require('express');
const router = express.Router();

// Import controller
const { testEndpoint } = require('../controllers/testController');

// Define route
router.get('/', testEndpoint);

module.exports = router;
