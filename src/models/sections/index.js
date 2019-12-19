const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class SectionsModel extends Model { }

SectionsModel.init({
    section_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    section_active: {
        type: Sequelize.TINYINT
    },
    section_css: {
        type: Sequelize.TINYINT
    },
    section_name: {
        type: Sequelize.STRING(200)
    }

},
    {
        sequelize: pool,
        timestamps: false,
        modelName: 'sections'
    });

    module.exports =  SectionsModel;