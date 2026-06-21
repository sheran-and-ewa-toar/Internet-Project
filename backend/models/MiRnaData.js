module.exports = (sequelize, DataTypes) => {
    const MiRnaData = sequelize.define('MiRnaData', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mirbase_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mirgenedb_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isPositive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, { validate: {
            eitherIdMustExist() {
                if (!this.mirbase_id && !this.mirgenedb_id) {
                    throw new Error('Validation failed: Either mirbase_id or mirgene_id must be provided.');
                }
            }
        }
    }
);

    return MiRnaData;
}