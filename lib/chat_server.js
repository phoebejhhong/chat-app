// keep track of the number of guests and their nicknames
var numGuests = 0,
nicknames = {};

var nicknameIsValid = function (nickname) {
  // nickname can't start with "guest"
  if (nickname.slice(0,5) === 'guest') {
    return false;
  } else {
    return true;
  };
};

var createChat = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    numGuests += 1;
    // assign a temparary nickname
    var temporaryNickname = 'guest ' + numGuests;
    nicknames[socket.id] = temporaryNickname;

    // when receiving user's input
    socket.on('message',function (message){
      // check if it's a request to change nickname
      if (message.slice(0,6) === '/nick ') {
        // get the new nickname
        newNickname = message.slice(6, message.length);
        if (nicknameIsValid(newNickname)) {
          // assign new nickname if valid
          nicknames[socket.id] = newNickname;
          socket.emit('nicknameChangeResult', {
            success: true,
            message: 'New nickname assigned'
          });
        } else {
          // send error message
          socket.emit('nicknameChangeResult', {
            success: false,
            message: 'Names cannot begin with "guest".'
          });
        };
      } else {
        io.emit('message', nicknames[socket.id] +": " + message);
      }
    });
  });
};

exports.createChat = createChat;
