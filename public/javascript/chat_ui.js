(function () {
  var socket = io();
  var chat = new ChatApp.Chat(socket);

  var chatInput = $("form");

  chatInput.on("submit", function (event) {
    event.preventDefault();
    // get the input
    var inputValue = $("#chat-input").val();
    // send the message to other users
    if (inputValue.slice(0,1) === "/") {
      chat.processCommand(inputValue.split(" "));
    } else {
      chat.sendMessage(inputValue);
    }

    // empty the input field
    $("#chat-input").val("");

    return false;
  });

  socket.on("message", function (message) {
    // add the message to the list
    $("#messages").append(
      $("<li>").text(message)
    );
  });

  socket.on("nicknameChangeResult", function (options) {
    // notify nickname change
    $("#messages").append(
      $("<li>").text(options.message)
    );
  });
})();
