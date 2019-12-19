const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class CategoriesModel extends Model { }

CategoriesModel.init({
    category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shop_id: {
        type: Sequelize.INTEGER
    },
    category_name: {
        type: Sequelize.STRING(150)
    },
    category_img: {
        type: Sequelize.STRING(150)
    },
    status_cat_active: {
        type: Sequelize.TINYINT
    },
    status_cat_css: {
        type: Sequelize.TINYINT
    },

}, {
        sequelize: pool,
        timestamps: false,
        modelName: 'category_foods'
    });

module.exports = CategoriesModel;