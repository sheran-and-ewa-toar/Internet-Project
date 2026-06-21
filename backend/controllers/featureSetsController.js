const { success, error } = require('../utils/responseHelpers');
const { FeatureSet } = require('../models');

const getAllFeatureSets = async (req, res) => {
    try {
        const featureSets = await FeatureSet.findAll();
        return res.status(200).json(success(featureSets));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch feature sets'));
    }
};

const getFeatureSetById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const featureSet = await FeatureSet.findByPk(id);

        if (!featureSet) {
            return res.status(404).json(error('NOT_FOUND', 'Feature set not found'));
        }

        return res.status(200).json(success(featureSet));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch feature set'));
    }
};

module.exports = {
    getAllFeatureSets,
    getFeatureSetById
};