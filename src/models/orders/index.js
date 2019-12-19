const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class OrdersModel extends Model { }

OrdersModel.init({
    order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: Sequelize.INTEGER
    },
    shop_id: {
        type: Sequelize.INTEGER
    },
    id_food: {
        type: Sequelize.INTEGER
    },
    table_room_id: {
        type: Sequelize.INTEGER
    },
    bills_id: {
        type: Sequelize.INTEGER
    },
    food_category_id: {
        type: Sequelize.INTEGER
    },
    qtd: {
        type: Sequelize.INTEGER
    },
    order_init_time: {
        type: Sequelize.TIME
    },
    order_time_get_it: {
        type: Sequelize.TIME
    },
    order_finished_time: {
        type: Sequelize.TIME
    },
    unit_price: {
        type: Sequelize.FLOAT
    },
    total_price: {
        type: Sequelize.FLOAT
    },
    status_info_check: {
        type: Sequelize.TINYINT
    },
    status_check_bills: {
        type: Sequelize.TINYINT
    },
    status_css: {
        type: Sequelize.TINYINT
    },
    datecreate: {
        type: Sequelize.DATE
    },
    status: {
        type: Sequelize.TINYINT
    },
    obs: {
        type: Sequelize.STRING(200)
    },
    adicional: {
        type: Sequelize.STRING(200)
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'orders'
});

module.exports = OrdersModel;