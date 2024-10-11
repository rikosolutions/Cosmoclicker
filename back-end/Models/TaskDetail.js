const {
    sequelize,
    DataTypes,
    Sequelize,
} = require("../config/mysql-sequelize");

const TaskDetail = sequelize.define(
    "TaskDetail", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.BIGINT,
            allowNull: false,
            
        },
        task_under_by: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        locked_task: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        unlocked_task: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        verify_task: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        success_task: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        success_task: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_all_task_completed: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'N',
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
        tableName: "task_details",
        timestamps: true,
        createdAt: "created_date",
        updatedAt: "modified_date",
    }
);

module.exports = TaskDetail;
