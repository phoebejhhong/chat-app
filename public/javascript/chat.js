(function () {
  if (typeof ChatApp === 'undefined') {
    window.ChatApp = {};
  };

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function (message) {
    this.socket.emit('message', message);
  };

  Chat.prototype.processCommand = function (command) {
    // command is an array of which the first element is the command name
    switch(command[0]) {
      case "/nick":
        this.socket.emit('nicknameChangeRequest', command[1]);
        break;
      default:
        this.sendMessage("No such command");
    };
  };
})();
