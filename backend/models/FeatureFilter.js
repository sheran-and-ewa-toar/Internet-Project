module.exports = (sequelize, DataTypes) => {
    const FeatureFilter = sequelize.define('FeatureFilter', {
        filterId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shortName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return FeatureFilter;
};