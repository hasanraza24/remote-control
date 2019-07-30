#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var http = require('http');
var robot = require('robotjs');
var os = require('os');

var handleSocketEvents = require('./socket');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

var io = require('socket.io')(server);

io.on('connection', (socket) => {
  handleSocketEvents(socket, robot);
  console.log('someon connected');
});

const ifaces = os.networkInterfaces();
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    Object.keys(ifaces).forEach(ifname =>
      ifaces[ifname].forEach(iface => {
        if(!iface.internal && iface.family === 'IPv4')
        console.log(`Can access on your network with this http://${iface.address}:${port}`)
      }
    ));
}
