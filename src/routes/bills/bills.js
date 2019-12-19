const express = require('express');
const BillsModel = require('./../../models/bills');
const bodyParser = require('body-parser');
const TableRoomsModel = require('../../models/tableRooms/tableRooms');

const router = express.Router();
const jsonParser = bodyParser.json();
const Sequelize = require('sequelize');
const moment = require('moment');

router.get('/getAll', async (req, res, next) => {
  try {
    const result = await BillsModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const result = await BillsModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/find_by_table/:id/:command', async (req, res, next) => {
  try {

    const table_room_id = req.params.id;
    const command = req.params.command;


    TableRoomsModel.hasOne(BillsModel, {
      foreignKey: 'table_room_id',
    });

    const result = await TableRoomsModel.findAll({
      where: {
        status_table_room_active: 1,
        table_room_id
      },
      include: [
        {
          model: BillsModel,
          required: false, // false: left join, true: inner join,
          where: {
            table_room_id,
            command_order_table: command
          },
        }
      ],
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    const command_order_table = req.body.command_order_table;
    const result = await BillsModel.update(req.body, {
      where: {
        command_order_table
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

// router.post('/getAllPagination', async (req, res, next) => {
//   try {
//     const page = req.body.page;
//     const limit = req.body.limit
//     let total = 0;
//     let pages = 0;

//     if (page === 0) {
//       total = await TableRoomsModel.count();
//       pages = Math.ceil(total / limit);
//     }

//     const result = await TableRoomsModel.findAll({
//       offset: limit * page,
//       limit
//     });

//     return res.status(200).send({
//       total,
//       pages,
//       result
//     });
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.get('/findPK/:id', async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const result = await TableRoomsModel.findByPk(id);
//     return res.status(200).send(result);
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.get('/findByField/:field/:value', async (req, res, next) => {
//   try {
//     const value = req.params.value;
//     const field = req.params.field;

//     const result = await TableRoomsModel.findAll({
//       where: {
//         [field]: {
//           [Sequelize.Op.like]: `%${value}%`
//         }
//       }
//     });
//     return res.status(200).send(result);
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.post('/findByFieldPagination', async (req, res, next) => {
//   try {
//     const value = req.body.value;
//     const field = req.body.field;
//     const page = req.body.page;
//     const limit = req.body.limit
//     let total = 0;
//     let pages = 0;

//     if (page === 0) {
//       total = await TableRoomsModel.count({
//         where: {
//           [field]: {
//             [Sequelize.Op.like]: `%${value}%`
//           }
//         }
//       });
//       pages = Math.ceil(total / limit);
//     }

//     const result = await TableRoomsModel.findAll({
//       where: {
//         [field]: {
//           [Sequelize.Op.like]: `%${value}%`
//         }
//       },
//       offset: limit * page,
//       limit
//     });

//     return res.status(200).send({
//       total,
//       pages,
//       result
//     });
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.post('/create', async (req, res, next) => {
//   try {
//     const result = await TableRoomsModel.create(req.body);
//     return res.status(200).send(result);
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.put('/update', async (req, res, next) => {
//   try {
//     const table_room_id = req.body.table_room_id;
//     const result = await TableRoomsModel.update(req.body, {
//       where: {
//         table_room_id
//       }
//     });
//     return res.status(200).send(result);
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.delete('/delete/:id', async (req, res, next) => {
//   try {
//     const table_room_id = req.params.id;
//     const result = await TableRoomsModel.destroy({
//       where: {
//         table_room_id
//       }
//     });
//     return res.sendStatus(200).send({
//       deleted: table_room_id
//     });
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.get('/findCustomers/:idTable', async (req, res, next) => {
//   try {
//     const table_room_id = req.params.idTable;

//     // many -> 1 : belongsTo
//     // 1 -> many : hasMany
//     // 1 -> 1 : hasOne

//     RelationUserTableRoomsModel.belongsTo(UsersModel, {
//       foreignKey: 'user_id'
//     });

//     RelationUserTableRoomsModel.findAll({
//         where: {
//           table_room_id,
//           table_room_active: 1
//         },
//         include: [{
//           model: UsersModel,
//           required: false, // false: left join, true: inner join,          
//         }]
//       })
//       .then(data => {
//         return res.status(200).send(data);
//       })
//       .catch(errData => {
//         return res.status(500).send(errData);
//       })
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.put('/inactiveTable', async (req, res, next) => {
//   try {
//     const table_room_id = req.body.table_room_id;
//     await RelationUserTableRoomsModel.update({
//       table_room_active: 0,
//       date_inactive: moment().format('YYYY-MM-DD'),
//       time_inactive: moment().format('HH:mm')
//     }, {
//       where: {
//         table_room_id,
//         table_room_active: 1
//       }
//     });
//     return res.status(200).send({
//       status: 'table inactivated'
//     });
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

// router.post('/activeTable', async (req, res, next) => {
//   try {
//     const result = await RelationUserTableRoomsModel.create(req.body);
//     return res.status(200).send(result);
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });

module.exports = router;