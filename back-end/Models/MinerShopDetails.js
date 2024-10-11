const { sequelize, DataTypes, Sequelize } = require("../config/mysql-sequelize");

const MinerShopDetails = sequelize.define(
    "miner_shop_details", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        minner_id: {
            type: DataTypes.INTEGER,
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
        user_spend_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0.000,
        },
        minner_level: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
    },
    {
        tableName: "miner_shop_details",
        timestamps: true,
        createdAt: "created_date",
        updatedAt: "modified_date",
    }
);



module.exports = MinerShopDetails;
