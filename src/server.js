const http = require('http');

const app = require('./app');
const logger = require('./loaders/winston');
const serverConfig = require('./configs/server');
const socketIo = require('./socket-io');

const server = http.createServer(app);

function normalizePort(port) {
  const portNum = parseInt(port, 10);

  if (Number.isNaN(portNum)) {
    return port;
  }

  if (portNum >= 0) {
    return portNum;
  }

  return false;
}

const port = normalizePort(serverConfig.port);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = `Pipe ${port}`;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const address = server.address();
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;

  logger.info(`Listening on ${bind}`);
}

app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

socketIo.attach(server);

module.exports = server;
