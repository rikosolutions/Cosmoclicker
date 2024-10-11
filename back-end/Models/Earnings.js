const {
    sequelize,
    DataTypes,
    Sequelize,
} = require("../config/mysql-sequelize");

const Earnings = sequelize.define(
    "Earnings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "tg_users",
                key: "userid",
            },
        },
        tap_score: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        last_tap_at: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        referral_score: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        last_login_at: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        task:{
            type: DataTypes.STRING,
            defaultValue: null,
        },task_score:{
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        mining_amount: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        last_mine_at: {
            type: DataTypes.DATE,
            defaultValue: null,
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
        tableName: "earnings",
        timestamps: true,
        createdAt: "created_date",
        updatedAt: "modified_date",
        hooks: {
            beforeSave: (earnings, options) => {
              if (earnings.tap_score < 0) {
                throw new Error(`tap_score value is lesser than 0 (-ve) \n ${JSON.stringify(earnings.dataValues)}`);
              }
            }
        }
    }
);

module.exports = Earnings;