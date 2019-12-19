
const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class EntryStocksModel extends Model { }

EntryStocksModel.init({
    entry_stock_id: {
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
    date_create:{
        type:Sequelize.DATE
    },
    lote:{
        type:Sequelize.INTEGER
    },
    provider_id: {
        type: Sequelize.INTEGER,
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'entry_stocks'
});

module.exports = EntryStocksModel;