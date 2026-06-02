const featureSets = require('../models/featureSets.json');

const getAllFeatureSets = (req, res) => {

    res.status(200).json({
        success: true,
        data: featureSets,
        error: null
    });
};

const getFeatureSetById = (req, res) => {

    const id = parseInt(req.params.id);

    const featureSet = featureSets.find(
        f => f.featureSetId === id
    );

    if (!featureSet) {

        return res.status(404).json({
            success: false,
            data: null,
            error: {
                code: 'NOT_FOUND',
                message: 'Feature set not found',
                details: {}
            }
        });
    }

    res.status(200).json({
        success: true,
        data: featureSet,
        error: null
    });
};

module.exports = {
    getAllFeatureSets,
    getFeatureSetById
};