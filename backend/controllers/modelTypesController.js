const { success, error } = require('../utils/responseHelpers');
const modelTypes = require('../models/modelTypes.json');

const getAllModelTypes = (req, res) => {
    res.status(200).json(success(modelTypes));
};

const getModelTypeById = (req, res) => {
    const id = parseInt(req.params.id);

    const modelType = modelTypes.find(
        m => m.modelTypeId === id
    );

    if (!modelType) {
        return res.status(404).json(
            error('NOT_FOUND', 'Model type not found')
        );
    }

    res.status(200).json(success(modelType));
};

module.exports = {
    getAllModelTypes,
    getModelTypeById
};