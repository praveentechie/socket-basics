var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('User connect via socket');

  socket.on('message', function(message) {
    console.log('Received message', message.text);
    message.timestamp = moment().valueOf();
    // for sending to everyone including sender
    io.emit('message', message);
    // for sending to everyone excluding sender
    // socket.broadcast.emit('message', message);
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
