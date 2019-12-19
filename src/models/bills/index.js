const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class BillsModel extends Model { }

BillsModel.init({
    bills_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    table_room_id: {
        type: Sequelize.INTEGER
    },
    total_bills: {
        type: Sequelize.FLOAT
    },
    pay_bills: {
        type: Sequelize.FLOAT
    },
    date_bills: {
        type: Sequelize.DATE
    },
    time_bills: {
        type: Sequelize.TIME
    },
    status_bills: {
        type: Sequelize.TINYINT
    },
    status_css: {
        type: Sequelize.TINYINT
    },
    command_order_table: {
        type: Sequelize.BIGINT
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'bills'
});

module.exports = BillsModel;