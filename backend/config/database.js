const dotenv = require('dotenv');
const path = require('path');
const { Sequelize } = require('sequelize');

dotenv.config({ path: path.join(__dirname, './.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'mirna_classifier_db',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: false,
        timezone: '+00:00',
        define: {
            timestamps: false,
            freezeTableName: true
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDatabase = async () => {
    await sequelize.authenticate();
    return sequelize;
};

module.exports = {
    sequelize,
    connectDatabase,
    Sequelize
};