const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class CashFlowEntriesModel extends Model { }

CashFlowEntriesModel.init({
    cash_flow_entry_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cash_flow_entry_name: {
        type: Sequelize.STRING(150)
    },
    cash_flow_entry_value: {
        type: Sequelize.FLOAT
    },
    date_create: {
        type: Sequelize.DATE
    },
    time_create: {
        type: Sequelize.TIME
    },
    status: {
        type: Sequelize.TINYINT
    }

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'cash_flow_entries'
});

module.exports = CashFlowEntriesModel;