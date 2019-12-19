const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class OfficesModel extends Model { }

OfficesModel.init({
    office_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    office_name: {
        type: Sequelize.STRING(150)
    },    
    office_active: {
        type: Sequelize.TINYINT
    }, 
    office_css: {
        type: Sequelize.TINYINT
    }, 

}, {
        sequelize: pool,
        timestamps: false,
        modelName: 'offices'
    });

    module.exports =  OfficesModel;