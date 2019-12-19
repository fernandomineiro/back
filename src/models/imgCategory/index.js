const pool = require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class imgCateoryModel extends Model { }

imgCateoryModel.init({
    img_cat_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url_img: {
        type: Sequelize.STRING(200)
    },
    status_css_img_cat: {
        type: Sequelize.TINYINT
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'imgs_categories'
});

module.exports = imgCateoryModel;