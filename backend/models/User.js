const { hashPassword, isPasswordHash } = require('../utils/passwordHelpers');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userRole: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user'
        },
        theme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'light'
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
    }, {
        hooks: {
            beforeCreate: (user) => {
                if (!user.password || isPasswordHash(user.password)) {
                    return;
                }

                user.password = hashPassword(user.password);
            }
        }
    });

    return User;
};