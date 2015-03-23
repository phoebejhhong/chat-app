// keep track of the number of guests and their nicknames
var numGuests = 1,
nicknames = {};

var createChat = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    socket.on('message',function (message){
      io.emit('message', message);
    });
  });
};

exports.createChat = createChat;
