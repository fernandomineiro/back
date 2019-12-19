const express = require('express');
const ChatModel = require('./../../models/chat');
const UsersModels = require('./../../models/users/users');
const ServersModel = require('./../../models/servers');
const router = express.Router();
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const And = Sequelize.and;

router.get('/getAll', async (req, res, next) => {
  try {
    const result = await ChatModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const result = await ChatModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});


router.post('/getMessages', async (req, res) => {

  const who = req.body;
  // retorna as mensagens que são de um mesmo server e user
  ChatModel.findAll({
    where: {
      senderuuid: {
        [Op.or]: [who.senderuuid, who.receiveruuid]
      },
      [Op.and]: {
        receiveruuid: {
          [Op.or]: [who.senderuuid, who.receiveruuid]
        }
      }
    },
    order: [
      ['chat_id', 'ASC'],
    ]
  }).then(resultado => {
    return res.json({ messages: resultado });
  }).catch(error => {
    console.log(error);
    return res.status(500).send(error);;
  })
}
)

router.get('/left-join/chat/users/:user_id_server/:user_id_customer', async (req, res, next) => {
  try {
    const user_id_customer = req.params.user_id_customer;
    const user_id_server = req.params.user_id_server;
    // many -> 1 : belongsTo
    // 1 -> many : hasMany
    // 1 -> 1 : hasOne


    ChatModel.belongsTo(UsersModels, {
      foreignKey: 'user_id_customer',
    });

    ChatModel.belongsTo(ServersModel, {
      foreignKey: 'user_id_server'
    });

    ChatModel.findAll({
      where: {
        user_id_customer,
        user_id_server
      },

      include: [
        {
          model: UsersModels,
          required: false, // false: left join, true: inner join,
        },
        {
          model: ServersModel,
          required: false,
          where: {
            id_server: user_id_server
          }
        }
      ],
      order: [
        ['date', 'ASC'],
        ['time', 'ASC'],
      ]
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(errData => {
        return res.status(500).send(errData);
      })
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

module.exports = router;