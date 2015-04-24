// keep track of the number of guests and their nicknames
var numGuests = 0,
nicknames = {};

var hasValue = function (obj, val) {
  for (var key in obj) {
    if (obj[key] === val) {
      return true;
    };
  };

  return false;
};

var nicknameIsValid = function (nickname) {
  // nickname can't start with "guest"
  if (nickname.slice(0,5) === 'guest') {
    return false;
  //iterate through nicknames to check if it already exists
} else if (hasValue(nicknames, nickname)) {
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
    io.emit('nicknameChangeResult', {
      success: true,
      message: nicknames[socket.id] + "has joined the chat.",
      });

    // when receiving user's input
    socket.on('message',function (message){
      // check if it's a request to change nickname
      if (message.slice(0,6) === '/nick ') {
        // get the new nickname
        newNickname = message.slice(6, message.length);

      } else {
        io.emit('message', nicknames[socket.id] +": " + message);
      }
    });

    socket.on('nicknameChangeRequest', function (newNickname) {
      if (nicknameIsValid(newNickname)) {
        // assign new nickname if valid
        var oldNickname = nicknames[socket.id];
        nicknames[socket.id] = newNickname;
        socket.emit('nicknameChangeResult', {
          success: true,
          message: oldNickname + ' is now ' + newNickname + '.',
        });
      } else {
        // send error message
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Name is already taken or begin with "guest".',
        });
      };
    });

  });
};

exports.createChat = createChat;
