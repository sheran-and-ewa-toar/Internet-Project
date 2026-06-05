const { success, error } = require('../utils/responseHelpers');
const featureSets = require('../models/featureSets.json');

const getAllFeatureSets = (req, res) => {
    res.status(200).json(success(featureSets));
};

const getFeatureSetById = (req, res) => {
    const id = parseInt(req.params.id);

    const featureSet = featureSets.find(
        f => f.featureSetId === id
    );

    if (!featureSet) {
        return res.status(404).json(
            error('NOT_FOUND', 'Feature set not found')
        );
    }

    res.status(200).json(success(featureSet));
};

module.exports = {
    getAllFeatureSets,
    getFeatureSetById
};