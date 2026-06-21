module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
        jobId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        featureSetId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        modelTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        featureSetName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        modelName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'queued'
        },
        accuracy: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        precision: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        recall: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        f1Score: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        cv_mean: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        cv_std: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        featureCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updateDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return Job;
};