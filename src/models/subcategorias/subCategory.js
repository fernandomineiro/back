const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class SubCategoriesModel extends Model { }

SubCategoriesModel.init({
    sub_category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: Sequelize.INTEGER
    },
    sub_category_name: {
        type: Sequelize.STRING(150)
    },   
    status: {
        type: Sequelize.TINYINT
    }, 

}, {
        sequelize: pool,
        timestamps: false,
        modelName: 'sub_category_foods'
    });

    module.exports =  SubCategoriesModel;