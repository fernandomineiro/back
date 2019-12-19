const pool =  require('../../config/pool');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ChatModel extends Model { }

ChatModel.init({
    chat_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chat: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.DATE
    },
    user_id_server: {
        type: Sequelize.INTEGER
    },
    user_id_customer: {
        type: Sequelize.INTEGER
    },
    time: {
        type: Sequelize.TIME
    },
    server_send: {
        type: Sequelize.BOOLEAN
    },
    customer_send: {
        type: Sequelize.BOOLEAN
    },
    status_css: {
        type: Sequelize.TINYINT
    },
    senderuuid: {
        type: Sequelize.STRING(255)
    },
    receiveruuid: {
        type: Sequelize.STRING(255)
    },
    socketid: {
        type: Sequelize.STRING(255)
    },

}, {
        sequelize: pool,
        timestamps: false,
        modelName: 'chats'
    });

    module.exports = ChatModel;