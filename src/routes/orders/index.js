const express = require('express');
const OrdersModel = require('./../../models/orders')
const FoodsModel = require('../../models/foods');
const TableRoomsModel = require('../../models/tableRooms/tableRooms');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('/create', async (req, res) => {
  try {
    const result = await OrdersModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    console.log(err);
    
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res) => {
  try {
    const order_id = req.body.order_id;
    const result = await OrdersModel.update(req.body, {
      where: {
        order_id
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/updateFinshOrdersByTable', async (req, res) => {
  try {
    const table_room_id = req.body.table_room_id;
    const result = await OrdersModel.update(req.body, {
      where: {
        table_room_id,
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getOrdersByTableActive/:idTable', async (req, res) => {
  try {
    const table_room_id = req.params.idTable;

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    OrdersModel.findAll({
      where: {
        table_room_id,
        [Op.or]: [{ status_info_check: 1 }, { status_info_check: 0 }, { status_info_check: 2 }, { status_info_check: 4 }],
      },
      include: [{
        model: FoodsModel,
        required: false, // false: left join, true: inner join,          
      }],
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

router.get('/getOrdersByTableActiveAndStatus/:idTable/:status', async (req, res) => {
  try {
    const table_room_id = req.params.idTable;
    const status_info_check = req.params.status;

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    OrdersModel.findAll({
      where: {
        table_room_id,
        status_info_check,
      },
      include: [{
        model: FoodsModel,
        required: false, // false: left join, true: inner join,          
      }]
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

// metodo 01
router.get('/left-join/table-room/foods', async (req, res) => {

  // pedidos, exceto status 02 - entregue
  try {

    OrdersModel.belongsTo(TableRoomsModel, {
      foreignKey: 'table_room_id',
    });

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    OrdersModel.findAll({
      where: {
        [Op.or]: [{ status_info_check: 1 }, { status_info_check: 0 }, { status_info_check: 2 }, { status_info_check: 4 }],
        // status_info_check: { $not: 2 } 
      },

      include: [
        {
          model: FoodsModel,
          required: false, // false: left join, true: inner join,
        },
        {
          model: TableRoomsModel,
          required: true,
          where: {
            status_table_room_active: 1
          }
        }
      ],
      order: [
        ['datecreate', 'ASC'],
        ['order_init_time', 'ASC'],
      ]
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(errData => {
        res.logger.log('error', errData);
        return res.status(500).send(errData);
      })
  } catch (err) {
    res.logger.log('error', err);

    return res.status(500).send(err);
  }
});

// methodo 02: via parametro
router.get('/left-join/table-room/foods/:params', async (req, res) => {

  try {

    const status_info_check = req.params.params;
    // many -> 1 : belongsTo
    // 1 -> many : hasMany
    // 1 -> 1 : hasOne

    OrdersModel.belongsTo(TableRoomsModel, {
      foreignKey: 'table_room_id',
    });

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    OrdersModel.findAll({
      where: {
        status_info_check,
      },

      include: [
        {
          model: FoodsModel,
          required: false, // false: left join, true: inner join,
        },
        {
          model: TableRoomsModel,
          required: true,
          where: {
            status_table_room_active: 1
          }
        }
      ],
      order: [
        ['datecreate', 'ASC'],
        ['order_init_time', 'ASC'],
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

// methodo 03: via parametro categoria
router.get('/left-join/table-room/foods/category/:params', async (req, res) => {

  try {

    const food_category_id = req.params.params;
    // many -> 1 : belongsTo
    // 1 -> many : hasMany
    // 1 -> 1 : hasOne

    OrdersModel.belongsTo(TableRoomsModel, {
      foreignKey: 'table_room_id',
    });

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    OrdersModel.findAll({

      where: {
        food_category_id,
      },

      include: [
        {
          model: FoodsModel,
          required: false, // false: left join, true: inner join,
        },
        {
          model: TableRoomsModel,
          required: true,
          where: {
            status_table_room_active: 1
          }
        }
      ],
      order: [
        ['datecreate', 'ASC'],
        ['order_init_time', 'ASC'],
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


router.get('/lastOrderId', async (req, res, ) => {

  OrdersModel.max('order_id').then(success => {
    return res.status(200).send({ order_id: success });
  }).catch(error => {
    console.log('error on call lastorder id', error);
  })
});


router.get('/totalOrders', async (req, res, ) => {

  try {

    OrdersModel.belongsTo(TableRoomsModel, {
      foreignKey: 'table_room_id',
    });

    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    OrdersModel.findAll({
      where: {
        [Op.or]: [{ status_info_check: 1 }, { status_info_check: 0 }, { status_info_check: 2 }, { status_info_check: 4 }],
        // status_info_check: { $not: 2 } 
      },

      include: [
        {
          model: FoodsModel,
          required: false, // false: left join, true: inner join,
        },
        {
          model: TableRoomsModel,
          required: true,
          where: {
            status_table_room_active: 1
          }
        }
      ]
    }).then(data => {
      return res.json({ total: data.length });
      // return data.length;
    }).catch(errData => {
      res.logger.log('error', errData);
      return res.status(500).send(errData);
    });
  } catch (err) {
    res.logger.log('error', err);

    return res.status(500).send(err);
  }
});

module.exports = router;