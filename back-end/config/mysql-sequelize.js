const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        timezone: "+00:00",
        logging: false,
    }
);

module.exports = {
    sequelize,
    DataTypes,
    Sequelize,
};