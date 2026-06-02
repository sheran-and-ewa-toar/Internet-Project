const featureFilters = require('../models/featureFilters.json');

const getAllFeatureFilters = (req, res) => {

    res.status(200).json({
        success: true,
        data: featureFilters,
        error: null
    });
};

const getFeatureFilterById = (req, res) => {

    const id = parseInt(req.params.id);

    const filter = featureFilters.find(
        f => f.filterId === id
    );

    if (!filter) {

        return res.status(404).json({
            success: false,
            data: null,
            error: {
                code: 'NOT_FOUND',
                message: 'Feature filter not found',
                details: {}
            }
        });
    }

    res.status(200).json({
        success: true,
        data: filter,
        error: null
    });
};

module.exports = {
    getAllFeatureFilters,
    getFeatureFilterById
};