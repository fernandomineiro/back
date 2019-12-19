const pool = require('./../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class TableRoomsModel extends Model { }

TableRoomsModel.init({
    table_room_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    table_room_name: {
        type: Sequelize.STRING(100)
    },
    tx_table: {
        type: Sequelize.TINYINT(1),
    },
    value_tx_table: {
        type: Sequelize.FLOAT(11)
    },
    tx_cover: {
        type: Sequelize.TINYINT(1)
    },
    value_tx_cover: {
        type: Sequelize.FLOAT(11)
    },
    status_table_room_active: {
        type: Sequelize.TINYINT(1)
    },
    status_table_room_css: {
        type: Sequelize.TINYINT(1)
    },
    status_bills: {
        type: Sequelize.TINYINT(1)
    },
    command_order_table: {
        type: Sequelize.BIGINT(20)
    },
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'table_rooms'
});

module.exports = TableRoomsModel;