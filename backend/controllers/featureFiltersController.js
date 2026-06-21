const { success, error } = require('../utils/responseHelpers');
const { FeatureFilter } = require('../models');

const getAllFeatureFilters = async (req, res) => {
    try {
        const featureFilters = await FeatureFilter.findAll();
        return res.status(200).json(success(featureFilters));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch feature filters'));
    }
};

const getFeatureFilterById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const featureFilter = await FeatureFilter.findByPk(id);

        if (!featureFilter) {
            return res.status(404).json(error('NOT_FOUND', 'Feature filter not found'));
        }

        return res.status(200).json(success(featureFilter));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch feature filter'));
    }
};

module.exports = {
    getAllFeatureFilters,
    getFeatureFilterById
};