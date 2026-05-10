const express = require('express');

const router = express.Router();

const {
    getAllModels
} = require('../controllers/modelsController');

router.get('/', getAllModels);

module.exports = router;