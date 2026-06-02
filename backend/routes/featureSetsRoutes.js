const express = require('express');

const router = express.Router();

const { validateParams } = require('../middleware/validationMiddleware');
const {
    getAllFeatureSets,
    getFeatureSetById
} = require('../controllers/featureSetsController');

router.get('/', getAllFeatureSets);

router.get('/:id', validateParams(['id']), getFeatureSetById);

module.exports = router;