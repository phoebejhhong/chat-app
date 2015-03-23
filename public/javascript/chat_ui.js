(function () {
  var socket = io();
  var chat = new ChatApp.Chat(socket);

  var chatInput = $("form");

  chatInput.on("submit", function (event) {
    event.preventDefault();
    // get the input
    var inputValue = $("#chat-input").val();
    // send the message to other users
    chat.sendMessage(inputValue);
    // add the message to the list
    $("#messages").append(
      $("<li>").text(inputValue)
    );

    // empty the input field
    $("#chat-input").val("");

    return false;
  });
})();
