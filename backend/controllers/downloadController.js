const Papa = require("papaparse");
const { error, successWithFile } = require("../utils/responseHelpers");

const {
    MiRnaData,
    MiRnaFeatureValue
} = require("../models");

const downloadDataset = async (req, res) => {
    try {

        const mirnas = await MiRnaData.findAll({
            include: [
                {
                    model: MiRnaFeatureValue,
                    as: "features",
                    attributes: [
                        "featureName",
                        "featureValue"
                    ]
                }
            ],
            order: [["id", "ASC"]]
        });

        const dataset = mirnas.map(mirna => {
            const row = {
                id: mirna.id,
                mirbase_id: mirna.mirbase_id,
                mirgenedb_id: mirna.mirgenedb_id,
                isPositive: mirna.isPositive
            };

            mirna.features.forEach(feature => {
                row[feature.featureName] =
                    feature.featureValue;
            });

            return row;
        });

        const csvContent = Papa.unparse(dataset);
        return successWithFile(res, csvContent, "mirna_dataset.csv");

    } catch (err) {
        
        res.removeHeader('Content-Disposition');
        res.setHeader('Content-Type', 'application/json');

        return res.status(500).json(
            error(
                "INTERNAL_ERROR",
                err.message
            )
        );
    }
};

module.exports = {
    downloadDataset
};