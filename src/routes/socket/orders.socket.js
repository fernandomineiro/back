const OrdersModel = require('./../../models/orders/index');
const FoodsModel = require('./../../models/orders/index');
const TableRoomsModel = require('../../models/tableRooms/tableRooms');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getAllOrders = async () => {
  try {
    //  const status_table_room_active = id;
    const result = await OrdersModel.findAll({
      where: {
        [Op.or]: [{status_info_check: 1}, {status_info_check: 0}, {status_info_check: 2}, {status_info_check: 4}],
        // status_info_check: { $not: 2 } 
      }
    });

    return result;
  } catch (err) {
    res.logger.log('error', err);
    return err;
  }
}

const getCountAllOrders = async () => {
  try {
    // retorna apenas o count 
    OrdersModel.belongsTo(TableRoomsModel, {
      foreignKey: 'table_room_id',
    });

    const result = await OrdersModel.findAndCountAll({
      where: {
        [Op.or]: [{status_info_check: 1}, {status_info_check: 0}, {status_info_check: 2},{status_info_check: 4}],
      },
      include: [
        {
          model: TableRoomsModel,
          required: true,
          where: {
            status_table_room_active: 1
          }
        }
      ]
    });

    return result.count;
  } catch (err) {

    console.log('error on get total orders', err);
  }
}

const getLastOrderId = async () => {
  try {
    // retorna apenas o count 
    const result = await OrdersModel.max('order_id');
    return result;
  } catch (err) {
    res.logger.log('error', err);
    return err;
  }
}

const getAllOrdersTableActive = async (id) => {
  try {
    const table_room_id = id;
    OrdersModel.belongsTo(FoodsModel, {
      foreignKey: 'id_food'
    });

    const result = OrdersModel.findAll({
      where: {
        table_room_id,
        status: 1
      },
      include: [{
        model: FoodsModel,
        required: false, // false: left join, true: inner join,          
      }],
    })
    return result;
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
}


const OrdersProcedure = { getAllOrders, getCountAllOrders, getLastOrderId, getAllOrdersTableActive };
module.exports = OrdersProcedure;
