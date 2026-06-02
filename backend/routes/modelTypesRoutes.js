const express = require('express');

const router = express.Router();

const { validateParams } = require('../middleware/validationMiddleware');
const {
    getAllModelTypes,
    getModelTypeById
} = require('../controllers/modelTypesController');

router.get('/', getAllModelTypes);

router.get('/:id', validateParams(['id']), getModelTypeById);

module.exports = router;
