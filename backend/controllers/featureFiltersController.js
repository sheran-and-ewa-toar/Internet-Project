const { success, error } = require('../utils/responseHelpers');
const featureFilters = require('../models/featureFilters.json');

const getAllFeatureFilters = (req, res) => {
    res.status(200).json(success(featureFilters));
};

const getFeatureFilterById = (req, res) => {
    const id = parseInt(req.params.id);

    const filter = featureFilters.find(
        f => f.filterId === id
    );

    if (!filter) {
        return res.status(404).json(
            error('NOT_FOUND', 'Feature filter not found')
        );
    }

    res.status(200).json(success(filter));
};

module.exports = {
    getAllFeatureFilters,
    getFeatureFilterById
};