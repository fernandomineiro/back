const pool = require('./../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ServersModel extends Model { }

ServersModel.init({
    id_server: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name_server: {
        type: Sequelize.STRING(100)
    },
    number_server: {
        type: Sequelize.INTEGER(11),
    },
    office_id: {
        type: Sequelize.INTEGER(11)
    },
    section_id: {
        type: Sequelize.INTEGER(1)
    },
    change: {
        type: Sequelize.TINYINT(11)
    },
    status_active: {
        type: Sequelize.TINYINT(11)
    },
    img_server: {
        type: Sequelize.STRING(200)
    },
    square_id: {
        type: Sequelize.INTEGER(11)
    },
    level_access: {
        type: Sequelize.INTEGER(11)
    },
    password: {
        type: Sequelize.STRING(255)
    },
    uuid: {
        type: Sequelize.STRING(255)
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'servers'
});

module.exports = ServersModel;