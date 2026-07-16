const Papa = require("papaparse");
const { error, successWithFile } = require("../utils/responseHelpers");

const {
    MiRnaData,
    MiRnaFeatureValue
} = require("../models");

const downloadDataset = async (req, res) => {
    try {
        const sampleSize = Math.min(
            parseInt(req.query.limit) || 100,
            1000
        );

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
            order: [
                ["id", "ASC"]
            ],
            limit: sampleSize
        });

        const dataset = mirnas.map(mirna => {
            const row = {
                id: mirna.id,
                mirbase_id: mirna.mirbase_id,
                mirgenedb_id: mirna.mirgenedb_id,
                isPositive: mirna.isPositive
            };

            if (mirna.features) {

                mirna.features.forEach(feature => {

                    row[feature.featureName] =
                        feature.featureValue;

                });

            }

            return row;
        });

        if (dataset.length === 0) {
            return res.status(404).json(
                error(
                    "NOT_FOUND",
                    "No dataset records found."
                )
            );
        }

        const csvContent = Papa.unparse(dataset);

        return successWithFile(
            res,
            csvContent,
            "mirna_sample_dataset.csv"
        );

    } catch (err) {
        console.error(
            "Dataset download failed:",
            err
        );

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