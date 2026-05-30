const express = require('express');

const router = express.Router();

const { validateParams } = require('../middleware/validationMiddleware');
const {
    getAllFeatureFilters,
    getFeatureFilterById
} = require('../controllers/featureFiltersController');

router.get('/', getAllFeatureFilters);

router.get('/:id', validateParams(['id']), getFeatureFilterById);

module.exports = router;