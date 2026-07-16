const Papa = require("papaparse");

const { error } = require("../utils/responseHelpers");

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


        res.setHeader(
            "Content-Disposition",
            "attachment; filename=mirna_sample_dataset.csv"
        );

        res.setHeader(
            "Content-Type",
            "text/csv"
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

            mirna.features.forEach(feature => {

                row[feature.featureName] =
                    feature.featureValue;

            });

            return row;
        });

        const csvContent = Papa.unparse(dataset);
        return res.send(csvContent);

    } catch (err) {
        console.error(
            "Dataset download failed:",
            err
        );

        if (!res.headersSent) {

            return res.status(500).json(
                error(
                    "INTERNAL_ERROR",
                    err.message
                )
            );

        }
    }
};

module.exports = {
    downloadDataset
};