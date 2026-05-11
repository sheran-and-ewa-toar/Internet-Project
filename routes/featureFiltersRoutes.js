const express = require('express');

const router = express.Router();

const {
    getAllFeatureFilters,
    getFeatureFilterById
} = require('../controllers/featureFiltersController');

router.get('/', getAllFeatureFilters);

router.get('/:id', getFeatureFilterById);

module.exports = router;