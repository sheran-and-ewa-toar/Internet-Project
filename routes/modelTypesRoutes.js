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


// Your server must accept JSON bodies using Express middleware. 
// ● For routes that accept a body (POST/PUT), validate required field