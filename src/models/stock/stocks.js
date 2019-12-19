const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class StockModel extends Model { }

StockModel.init({
    stock_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    food_id: {
        type: Sequelize.INTEGER,
    },
    qtd: {
        type: Sequelize.INTEGER,
    },
    food_purchase_price: {
        type: Sequelize.FLOAT
    },
    provider_id: {
        type: Sequelize.INTEGER,
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'stocks'
});

module.exports = StockModel;