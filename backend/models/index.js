const { DataTypes } = require('sequelize');
const { sequelize, connectDatabase, Sequelize } = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Job = require('./Job')(sequelize, DataTypes);
const FeatureSet = require('./FeatureSet')(sequelize, DataTypes);
const FeatureFilter = require('./FeatureFilter')(sequelize, DataTypes);
const ModelType = require('./ModelType')(sequelize, DataTypes);
const MiRnaData = require('./MiRnaData')(sequelize, DataTypes);
const MiRnaFeatureValue = require('./MiRnaFeatureValue')(sequelize, DataTypes);
const JobFilter = require('./JobFilter')(sequelize, DataTypes);

User.hasMany(Job, { foreignKey: 'userId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Job.belongsToMany(FeatureFilter, { 
    through: JobFilter, 
    foreignKey: 'jobId', 
    otherKey: 'filterId', 
    as: 'appliedFilters' 
});

FeatureFilter.belongsToMany(Job, { 
    through: JobFilter, 
    foreignKey: 'filterId', 
    otherKey: 'jobId',
    as: 'jobs'
});

MiRnaData.hasMany(MiRnaFeatureValue, { foreignKey: 'mirnaId', as: 'features' });
MiRnaFeatureValue.belongsTo(MiRnaData, { foreignKey: 'mirnaId', as: 'mirna' });

module.exports = {
    sequelize,
    Sequelize,
    connectDatabase,
    User,
    Job,
    FeatureSet,
    FeatureFilter,
    ModelType,
    MiRnaData,
    MiRnaFeatureValue,
    JobFilter
};