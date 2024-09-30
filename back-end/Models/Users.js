const {
    sequelize,
    DataTypes,
    Sequelize,
} = require("../config/mysql-sequelize");

const Users = sequelize.define(
    "users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        langauage_code: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        referral_code: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        referral_by: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        referral_claim: {
            type: DataTypes.ENUM("Y", "N"),
            allowNull: false,
            defaultValue: "N",
        },
        is_tg_premium_user: {
            type: DataTypes.ENUM("Y", "N"),
            allowNull: false,
            defaultValue: "N",
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
    }, {
        tableName: "users",
        timestamps: true,
        createdAt: "created_date",
        updatedAt: "modified_date",
    }
);

module.exports = Users;