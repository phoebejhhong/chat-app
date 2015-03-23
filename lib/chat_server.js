
var createChat = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    socket.emit('message', { text: 'hello world'});
  });
};

exports.createChat = createChat;
