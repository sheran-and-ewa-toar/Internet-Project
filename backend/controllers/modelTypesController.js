const { success, error } = require('../utils/responseHelpers');
const { ModelType } = require('../models'); // Centralized ORM models registry

// 1. GET ALL MODEL TYPES FROM DB
const getAllModelTypes = async (req, res) => {
    try {
        const modelTypes = await ModelType.findAll();
        return res.status(200).json(success(modelTypes));
    } catch (err) {
        return res.status(500).json(
            error('INTERNAL_ERROR', 'Failed to retrieve model types: ' + err.message)
        );
    }
};

// 2. GET SPECIFIC MODEL TYPE BY ID FROM DB
const getModelTypeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const modelType = await ModelType.findByPk(id);

        if (!modelType) {
            return res.status(404).json(
                error('NOT_FOUND', 'Model type not found')
            );
        }

        return res.status(200).json(success(modelType));
    } catch (err) {
        return res.status(500).json(
            error('INTERNAL_ERROR', 'Failed to retrieve model type: ' + err.message)
        );
    }
};

module.exports = {
    getAllModelTypes,
    getModelTypeById
};