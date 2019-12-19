const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ProvidersModel extends Model { }

ProvidersModel.init({
    provider_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provider_name: {
        type: Sequelize.STRING(110)
    },
    provider_contact: {
        type: Sequelize.STRING(110)
    },
    provider_address_line_one: {
        type: Sequelize.STRING(130)
    },
    provider_address_line_two: {
        type: Sequelize.STRING(130),
        defaultValue: null
    },
    cnpj: {
        type: Sequelize.STRING(100)
    },
    insc: {
        type: Sequelize.STRING(100)
    },
    status_css: {
        type: Sequelize.TINYINT
    },
    status_active: {
        type: Sequelize.TINYINT
    },

}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'providers'
});

module.exports = ProvidersModel;