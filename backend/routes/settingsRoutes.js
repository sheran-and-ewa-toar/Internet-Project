const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
    getSettings,
    updateSettings
} = require('../controllers/settingsController');

router.get('/', authMiddleware.isAuthenticated, getSettings);
router.put('/', authMiddleware.isAuthenticated, updateSettings);

module.exports = router;
