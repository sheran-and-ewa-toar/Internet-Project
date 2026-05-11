const express = require('express');

const router = express.Router();

const {
    getAllModelTypes,
    getModelTypeById
} = require('../controllers/modelTypesController');

router.get('/', getAllModelTypes);

router.get('/:id', getModelTypeById);

module.exports = router;