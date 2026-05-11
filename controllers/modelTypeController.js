const modelTypes = require('../models/modelTypes.json');

const getAllModelTypes = (req, res) => {

    res.status(200).json({
        success: true,
        data: modelTypes,
        error: null
    });
};

const getModelTypeById = (req, res) => {

    const id = parseInt(req.params.id);

    const modelType = modelTypes.find(
        m => m.modelTypeId === id
    );

    if (!modelType) {

        return res.status(404).json({
            success: false,
            data: null,
            error: {
                code: 'NOT_FOUND',
                message: 'Model type not found',
                details: {}
            }
        });
    }

    res.status(200).json({
        success: true,
        data: modelType,
        error: null
    });
};

module.exports = {
    getAllModelTypes,
    getModelTypeById
};