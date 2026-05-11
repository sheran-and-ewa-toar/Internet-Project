const express = require('express');

const router = express.Router();

const {
    getAllFeatureSets,
    getFeatureSetById
} = require('../controllers/featureSetsController');

router.get('/', getAllFeatureSets);

router.get('/:id', getFeatureSetById);

module.exports = router;