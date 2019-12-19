const TableRoomsModel = require('./../../models/tableRooms/tableRooms');

const getAllStatus = async (id) => {
    try {
        const status_table_room_active = id;
        const result = await TableRoomsModel.findAll({
          where: {
            status_table_room_active
          }
        });
        
        return result;
      } catch (err) {
        res.logger.log('error', err);
        return err;
      }
}

const tableRoomsProcedure = { getAllStatus };
module.exports = tableRoomsProcedure;