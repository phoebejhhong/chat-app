// keep track of the number of guests and their nicknames and rooms
var numGuests = 0,
  nicknames = {},
  currentRooms = {};

// helper to find certain value exists in an object
var hasValue = function (obj, val) {
  for (var key in obj) {
    if (obj[key] === val) {
      return true;
    };
  };

  return false;
};

// helper to check if nickname is valid
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

// helper to join a socket to a room and update currentRooms
var joinRoom = function (socket, room) {
  socket.join(room);
  // assign an empty array if the socket id doesn't have any room yet
  currentRooms[socket.id] = currentRooms[socket.id] || [];
  // add a newly joined room
  currentRooms[socket.id] += room;
};

var createChat = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    // automatically join the 'lobby' room
    joinRoom(socket, 'lobby');

    // assign a temparary nickname
    numGuests += 1;
    var temporaryNickname = 'guest ' + numGuests;
    nicknames[socket.id] = temporaryNickname;
    io.to('lobby').emit('nicknameChangeResult', {
      success: true,
      message: nicknames[socket.id] + " has joined the chat.",
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

    socket.on('disconnect', function (socket) {
      delete nicknames[socket.id];
    });
  });
};

exports.createChat = createChat;
