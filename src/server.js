/*
* Server configuration
* Author: Miguel Carlos
* @micajeho
*/

'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const appConfig = require('./config/app-config');
const socketEvents = require('./routes/socket/socket');
const Logger = require('./infra/logger');

class Server {

  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
    this.socket = socketio(this.http);
  }

  appConfig() {
    new appConfig(this.app).includeConfig();
  }

  /* Including app Routes ends*/

  appExecute() {
    this.appConfig();

    const port = process.env.PORT || 3000;
    // const host = process.env.HOST || `localhost`;
    var server = this.app.listen(port, () => {
      console.log(`Server Listening on: ${port}`);
      const logger = new Logger();
      logger.log('info', `Server Init at ${new Date().toISOString()}`);
      
    });

    // Add a connect listener
    var io = require('socket.io')(server);
    new socketEvents(io);
  }
}

const app = new Server();
app.appExecute();