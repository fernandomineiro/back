const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class FoodsModel extends Model { }

FoodsModel.init({
    id_food: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shop_id: {
        type: Sequelize.INTEGER
    },
    food_name: {
        type: Sequelize.STRING(150)
    },
    food_bar_code: {
        type: Sequelize.STRING(150)
    },
    food_price: {
        type: Sequelize.FLOAT
    },
    food_purchase_product_price: {
        type: Sequelize.FLOAT
    },
    food_type: {
        type: Sequelize.STRING(150)
    },
    category_id: {
        type: Sequelize.INTEGER
    },
    sub_category_id: {
        type: Sequelize.INTEGER
    },
    section_id: {
        type: Sequelize.INTEGER
    },
    food_img: {
        type: Sequelize.STRING(250)
    },
    note: {
        type: Sequelize.STRING(250)
    },
    qtd: {
        type: Sequelize.INTEGER
    },
    qtd_stock: {
        type: Sequelize.INTEGER
    },
    stock_active: {
        type: Sequelize.TINYINT
    },
    class_status: {
        type: Sequelize.TINYINT
    },
    sales_price: {
        type: Sequelize.FLOAT
    },
    sales_status: {
        type: Sequelize.TINYINT
    },
    sales_date_start: {
        type: Sequelize.DATE
    },
    sales_date_end: {
        type: Sequelize.DATE
    },
    sales_status_period: {
        type: Sequelize.TINYINT
    },
    logic_price_food_status: {
        type: Sequelize.TINYINT
    },
    status: {
        type: Sequelize.TINYINT
    },
    provider_id: {
        type: Sequelize.TINYINT
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'foods'
});

module.exports = FoodsModel;