var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];
  if (info) {
    Object.keys(clientInfo).forEach(function (socketId) {
      var userInfo = clientInfo[socketId];
      if (info.room === userInfo.room) {
        users.push(userInfo.name);
      }
    });
    socket.emit('message', {
      name: 'System',
      text: 'Current users ' + users.join(', ')
    });
  } else {
    return;
  }
  return users.join(',');
}

io.on('connection', function(socket){
  console.log('User connect via socket');

  socket.on('disconnect', function(req) {
    if (clientInfo[socket.id]) {
      socket.leave(clientInfo[socket.id].room);
      io.to(clientInfo[socket.id].room).emit('message', {
        name: 'System',
        text: clientInfo[socket.id].name + ' left the chat',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('joinRoom', function(req) {
    // socket.id - unique id for room
    clientInfo[socket.id] = req;
    // join to only the room
    socket.join(req.room);
    // inform joined to all expect one joined
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined',
      timestamp: moment().valueOf()
    });
  });

  socket.on('message', function(message) {
    console.log('Received message', message.text);
    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      // for sending to everyone including sender
      io.to(clientInfo[socket.id].room).emit('message', message);
      // for sending to everyone excluding sender
      // socket.broadcast.emit('message', message);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Welcome to chat',
    timestamp: moment().valueOf()
  });
});

http.listen(PORT, function() {
  console.log('server started');
});
