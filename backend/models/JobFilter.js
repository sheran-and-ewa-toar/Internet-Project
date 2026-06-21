module.exports = (sequelize, DataTypes) => {
    const JobFilter = sequelize.define('JobFilter', {
        jobId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'Job',
                key: 'jobId'
            }
        },
        filterId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'FeatureFilter',
                key: 'filterId'
            }
        },
        thresholdValue: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }, {
        tableName: 'JobFilter',
        timestamps: false
    });

    return JobFilter;
};