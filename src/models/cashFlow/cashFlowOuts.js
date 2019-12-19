const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class CashFlowOutsModel extends Model { }

CashFlowOutsModel.init({
    cash_flow_out_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cash_flow_out_name: {
        type: Sequelize.STRING(150)
    },
    cash_flow_out_value: {
        type: Sequelize.FLOAT
    },
    date_create: {
        type: Sequelize.DATE,
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
    modelName: 'cash_flow_outs'
});

module.exports = CashFlowOutsModel;