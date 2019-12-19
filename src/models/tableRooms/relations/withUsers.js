const pool =  require('./../../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class RelationUserTableRoomsModel extends Model {}

RelationUserTableRoomsModel.init({
    table_room_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    date: {
        type: Sequelize.DATE,
    },
    time: {
        type: Sequelize.TIME
    },
    date_inactive: {
        type: Sequelize.DATE,
    },
    time_inactive: {
        type: Sequelize.TIME
    },
    table_room_active: {
        type: Sequelize.TINYINT(1)
    }
}, {
    sequelize: pool,
    timestamps: false,
    modelName: 'relation_users_table_rooms'
});

module.exports =  RelationUserTableRoomsModel;