const io = require('socket.io');

const socketIoConfig = require('../configs/socket-io');

const socketIo = io(socketIoConfig);

const chatSocketRoute = require('./chat');

chatSocketRoute(socketIo);

module.exports = socketIo;
