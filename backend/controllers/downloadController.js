const Papa = require("papaparse");

const {
    MiRnaData,
    MiRnaFeatureValue
} = require("../models");

const downloadDataset = async (req, res) => {
    try {
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=mirna_dataset.csv"
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
            order: [["id", "ASC"]]
        });

        let headersWritten = false;

        for (const mirna of mirnas) {
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

            const csvRow = Papa.unparse(
                [row],
                {
                    header: !headersWritten
                }
            );

            res.write(csvRow);
            headersWritten = true;
        }

        res.end();

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