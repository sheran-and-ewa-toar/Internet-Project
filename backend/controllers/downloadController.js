const Papa = require("papaparse");

const {
    MiRnaData,
    MiRnaFeatureValue
} = require("../models");

const { success, error } =
    require("../utils/responseHelpers");

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

        const csv =
            Papa.unparse(dataset);

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=mirna_dataset.csv"
        );

        return res.status(200).send(csv);

    } catch (err) {
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