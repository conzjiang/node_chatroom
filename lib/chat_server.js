function createChat(server) {
  var io = require('socket.io').listen(server);
  var guestNumber = 1;
  var nicknames = {};

  io.sockets.on("connection", function (socket) {
    socket.emit("welcome", { text: "welcome to sockets" });

    var nickname = nicknames[socket.id] = "guest" + guestNumber;
    socket.emit("nicknameAdded", { nickname: nickname });
    socket.broadcast.emit("newGuest", { nickname: nickname });
    guestNumber++;

    socket.on("message", function (data) {
      io.sockets.emit("sendMessage", {
        nickname: nicknames[socket.id],
        text: data.text
      });
    });
  });
}

exports.createChat = createChat;