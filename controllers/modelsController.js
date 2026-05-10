const models = require('../models/models.json');

const getAllModels = (req, res) => {
    res.status(200).json(models);
};

module.exports = {
    getAllModels
};