
const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class OutStocksModel extends Model { }

OutStocksModel.init({
    out_stock_id: {
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
    date_create: {
        type: Sequelize.DATE
    },
    provider_id: {
        type: Sequelize.INTEGER,
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'out_stocks'
});

module.exports = OutStocksModel;