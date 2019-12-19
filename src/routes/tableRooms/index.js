const express = require('express');
const TableRoomsModel = require('./../../models/tableRooms/tableRooms');
const UsersModel = require('./../../models/users/users');
const FoodsModel = require('../../models/foods/index');
const OrdersModel = require('../../models/orders/index');
const RelationUserTableRoomsModel = require('../../models/tableRooms/relations/withUsers');
const router = express.Router();
const Sequelize = require('sequelize');
const moment = require('moment');

router.get('/getAll', async (req, res, next) => {
  try {
    const result = await TableRoomsModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getAllStatus/:id', async (req, res, next) => {
  try {
    const status_table_room_active = req.params.id;
    // console.log('obtendo as mesas inativas', status_table_room_active);
    const result = await TableRoomsModel.findAll({
      where: {
        status_table_room_active
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/getAllPagination', async (req, res, next) => {
  try {
    const page = req.body.page;
    const limit = req.body.limit
    let total = 0;
    let pages = 0;

    if (page === 0) {
      total = await TableRoomsModel.count();
      pages = Math.ceil(total / limit);
    }

    const result = await TableRoomsModel.findAll({
      offset: limit * page,
      limit
    });

    return res.status(200).send({
      total,
      pages,
      result
    });
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/findPK/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TableRoomsModel.findByPk(id);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/findByField/:field/:value', async (req, res, next) => {
  try {
    const value = req.params.value;
    const field = req.params.field;

    const result = await TableRoomsModel.findAll({
      where: {
        [field]: {
          [Sequelize.Op.like]: `%${value}%`
        }
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/findByFieldPagination', async (req, res, next) => {
  try {
    const value = req.body.value;
    const field = req.body.field;
    const page = req.body.page;
    const limit = req.body.limit
    let total = 0;
    let pages = 0;

    if (page === 0) {
      total = await TableRoomsModel.count({
        where: {
          [field]: {
            [Sequelize.Op.like]: `%${value}%`
          }
        }
      });
      pages = Math.ceil(total / limit);
    }

    const result = await TableRoomsModel.findAll({
      where: {
        [field]: {
          [Sequelize.Op.like]: `%${value}%`
        }
      },
      offset: limit * page,
      limit
    });

    return res.status(200).send({
      total,
      pages,
      result
    });
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const result = await TableRoomsModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

// ATENÇÃO
// chamado apenas para atualizar informações da mesa, abrir uma mesa é outro método
router.put('/update', async (req, res, next) => {
  try {
    const table_room_id = req.body.table_room_id;
    const result = await TableRoomsModel.update(req.body, {
      where: {
        table_room_id
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});


router.put('/openTable', async (req, res) => {
  // passo 01: encontra a mesa
  // passo 02, verifica se precisa gerar o número de comanda.
  // passo 03: se precisar gera o número de comanda

  let table_room_id = req.body.table_room_id;

  try {
    const table = await TableRoomsModel.findOne({
      where: {
        table_room_id
      },
    });
    if (!table.command_order_table || table.command_order_table === 0) {
      const command_order_table = regerateCommandId(table_room_id);

      active = {
        table_room_id,
        status_table_room_active: 1,
        command_order_table
      }
    } else {
      active = {
        table_room_id,
        status_table_room_active: 1
      }
    }
    TableRoomsModel.update(active, {
      where: {
        table_room_id
      }
    }).then((result) => {
      return res.status(200).send(result);
    }).catch(error => {
      console.log(error);
      return res.status(500).send(err);
    });
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
})

router.put('/updateAll', async (req, res) => {
  try {

    const result = await TableRoomsModel.update(req.body, {
      where: {}
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const table_room_id = req.params.id;
    const result = await TableRoomsModel.destroy({
      where: {
        table_room_id
      }
    });
    return res.sendStatus(200).send({
      deleted: table_room_id
    });
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/findCustomers/:idTable', async (req, res, next) => {
  try {
    const table_room_id = req.params.idTable;

    // many -> 1 : belongsTo
    // 1 -> many : hasMany
    // 1 -> 1 : hasOne

    RelationUserTableRoomsModel.belongsTo(UsersModel, {
      foreignKey: 'user_id'
    });

    RelationUserTableRoomsModel.findAll({
      where: {
        table_room_id,
        table_room_active: 1
      },
      include: [{
        model: UsersModel,
        required: false, // false: left join, true: inner join,          
      }]
    }).then(data => {
      return res.status(200).send(data);
    }).catch(errData => {
      return res.status(500).send(errData);
    })
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/inactiveTable', async (req, res) => {

  try {
    const table_room_id = req.body.table_room_id;
    await RelationUserTableRoomsModel.update({
      table_room_active: 0,
      date_inactive: moment().format('YYYY-MM-DD'),
      time_inactive: moment().format('HH:mm')
    }, {
      where: {
        table_room_id,
        table_room_active: 1
      }
    });
    return res.status(200).send({
      status: 'table inactivated'
    });
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/activeTable', async (req, res, next) => {
  try {
    const result = await RelationUserTableRoomsModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getOrdersActivesWaiters', async (req, res, next) => {
  try {

    // many -> 1 : belongsTo
    // 1 -> many : hasMany
    // 1 -> 1 : hasOne


    TableRoomsModel.hasMany(OrdersModel, {
      foreignKey: 'table_room_id'
    });

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });



    TableRoomsModel.findAll({
      where: {
        status_table_room_active: 1
      },
      include: [
        {
          model: OrdersModel,
          required: false, // false: left join, true: inner join,
          include: [
            FoodsModel
          ]
        }
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


// método para gera o Id da comanda
function regerateCommandId(tableId) {
  let epocTIme = new Date().getTime().toString(); // retorn string

  let idRoom = tableId.toString();
  let subString = epocTIme.substr(0, idRoom.length);

  // replace 0 to idRoom.length
  const newID = epocTIme.replace(subString, idRoom);

  return newID;
}

module.exports = router;