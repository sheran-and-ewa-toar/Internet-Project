module.exports = (sequelize, DataTypes) => {
    const MiRnaFeatureValue = sequelize.define('MiRnaFeatureValue', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        mirnaId: { type: DataTypes.INTEGER, allowNull: false },
        featureName: { type: DataTypes.STRING, allowNull: false },
        featureValue: { type: DataTypes.TEXT, allowNull: false }
    },{ 
        tableName: 'MiRnaFeatureValue', 
        timestamps: false,
        indexes: [{ fields: ['mirnaId', 'featureName'] }]
    });
    return MiRnaFeatureValue;
};