/*
Socket de conexao entre os usuários da app
*/

'use strict';

const queryHandler = require('./../../handlers/query-handler');
const CONSTANTS = require('../../config/constants');
const tableRoomsProcedure = require('../../routes/socket/tableRooms.socket');
const ordersProcedure = require('../../routes/socket/orders.socket');
const Logger = require('../../infra/logger');

const logger = new Logger();

class Socket {

  constructor(socket) {
    this.io = socket;
    this.socketEvents();
  }

  socketEvents() {
    // chat events
    this.io.on('connection', (socket) => {
      /* Get the user's Chat list	*/
      socket.on(`chat-list`, async (data) => {
        // tratar quando um usuário for garçon ou usuário do sistema? talvez não
        if (data.userId == '') {
          this.io.emit(`chat-list-response`, {
            error: true,
            message: CONSTANTS.USER_NOT_FOUND
          });
        } else {
          try {
            const [UserInfoResponse, chatlistResponse] = await Promise.all([
              queryHandler.getUserInfo({
                userId: data.userId,
                socketId: false,

              }),
              queryHandler.getChatList(socket.id)
            ]);
            this.io.to(socket.id).emit(`chat-list-response`, {
              error: false,
              singleUser: false,
              chatList: chatlistResponse
            });
            socket.broadcast.emit(`chat-list-response`, {
              error: false,
              singleUser: true,
              chatList: UserInfoResponse
            });
          } catch (error) {
            this.io.to(socket.id).emit(`chat-list-response`, {
              error: true,
              chatList: []
            });
          }
        }
      });

			/**
			* send the messages to the user
			*/
      socket.on(`add-message`, async (data) => {

        if (data.chat === '') {

          this.io.to(socket.id).emit(`add-message-response`, {
            error: true,
            message: CONSTANTS.MESSAGE_NOT_FOUND
          });
        } else if (data.senderuuid === '') {

          this.io.to(socket.id).emit(`add-message-response`, {
            error: true,
            message: CONSTANTS.SERVER_ERROR_MESSAGE
          });
        } else if (data.receiveruuid === '') {
          this.io.to(socket.id).emit(`add-message-response`, {
            error: true,
            message: CONSTANTS.SELECT_USER
          });
        } else {
          try {
            // refaoracao necess'ria, ao loga o usuário e conectar o socket, armazenar no seu usuário o socketID que ele está usando para enviar a mensagem para ele
            // this.io.to(toSocketId).emit(`add-message-response`, data);
            // método comentado acima envia para o Id do usuário no socket que ele estiver usando

            const [messageResult] = await Promise.all([queryHandler.insertMessages(data, socket.id)]);

            //devolvo para quem chamou o status da mensagem enviada
            this.io.emit(`add-message-response`, data);

          } catch (error) {
            this.io.to(socket.id).emit(`add-message-response`, {
              error: true,
              message: CONSTANTS.MESSAGE_STORE_ERROR
            });
          }
        }
      });


			/**
			* Logout de usuário
			*/
      socket.on('logout', async (data) => {
        try {
          const userId = data.userId;
          await queryHandler.logout(userId);
          this.io.to(socket.id).emit(`logout-response`, {
            error: false,
            message: CONSTANTS.USER_LOGGED_OUT,
            userId: userId
          });

          socket.broadcast.emit(`chat-list-response`, {
            error: false,
            userDisconnected: true,
            userid: userId
          });
        } catch (error) {
          this.io.to(socket.id).emit(`logout-response`, {
            error: true,
            message: CONSTANTS.SERVER_ERROR_MESSAGE,
            userId: userId
          });
        }
      });


      /*
      System messages between applications 
      */

      socket.on('getAllStatusAtivos', async () => {

        const result = await tableRoomsProcedure.getAllStatus(1);

        this.io.emit('resultGetAllAtivos', result);
      });

      socket.on('getAllOrders', async () => {

        const result = await ordersProcedure.getAllOrders();
        
        this.io.emit('resultAllOrders', result);
      });


      socket.on('getCountAllOrders', async () => {
        try {

          const result = await ordersProcedure.getCountAllOrders();
          // emito também o id do último pedido para atualizar no dashboard
          const maxid = await ordersProcedure.getLastOrderId();
          let retorno = {
            total: result,
            lastId: maxid
          }
          this.io.emit('resultCountAllOrders', retorno);
        } catch (error) {
          //todo logar error
          logger.log('error', `Error on load total de pedidos: ${error}`)
        }
      });

      socket.on('getAllOrdersByTableId', async (id) => {
        const result = await ordersProcedure.getAllOrdersTableActive(id);
        this.io.emit('resultAllOrdersByTableId', { id: id, result: result });

      });

      socket.on('notifyTableClosed', async (id) => {
        const objRetorno = { tableClosed: true, tableId: id }

        this.io.emit('resultNotifyTableClosed', objRetorno);
      });

			/**
			* sending the disconnected user to all socket users. 
			*/
      socket.on('disconnect', async () => {
        socket.broadcast.emit(`chat-list-response`, {
          error: false,
          userDisconnected: true,
          userid: socket.request._query['userId']
        });
        this.io.emit('disconnected');
      });
    });

  }

  // socketConfig() {
  //   this.io.use(async (socket, next) => {
  //     try {
  //       await queryHandler.addSocketId({
  //         userId: socket.request._query['userId'],
  //         socketId: socket.id
  //       });
  //       next();
  //     } catch (error) {
  //       // Error
  //       console.error(error);
  //     }
  //   });

  // this.socketEvents();
  // }
}
module.exports = Socket;