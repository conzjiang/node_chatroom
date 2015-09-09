var NicknameManager = require("./nickname_manager");
var HandleNickname = require("./handle_nickname");
var HandleMessages = require("./handle_messages");
var HandleTyping = require("./handle_typing");

function createChat(server) {
  var io = require('socket.io').listen(server);
  var nicknameManager = new NicknameManager();

  io.on("connection", function (socket) {
    socket.emit("connected", {
      id: socket.id,
      tempNick: nicknameManager.newGuest()
    });

    new HandleNickname({
      socket: socket,
      allSockets: io,
      nicknameManager: nicknameManager
    });

    new HandleMessages({
      socket: socket,
      allSockets: io
    });

    new HandleTyping({
      socket: socket
    });
  });
}

exports.createChat = createChat;
