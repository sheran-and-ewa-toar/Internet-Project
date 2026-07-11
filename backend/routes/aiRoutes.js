const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { explainJob } = require('../controllers/aiController');

router.post(
    '/explain-job',
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles(['user', 'manager', 'admin']),
    explainJob
);

module.exports = router;
