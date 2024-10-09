const { sequelize, DataTypes, Sequelize } = require("../config/mysql-sequelize");

const MinerShop = sequelize.define(
    "MinerShop", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        profit_per_hr: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0.000,
        },
        profit_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0.000,
        },
        purchase_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0.000,
        },
        type: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        modified_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "active",
        },
    }, 
    {
        tableName: "miner_shop",
        timestamps: true,
        createdAt: "created_date",
        updatedAt: "modified_date",
    }
);

module.exports = MinerShop;
