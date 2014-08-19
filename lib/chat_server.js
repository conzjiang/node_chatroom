function createChat(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on("connection", function (socket) {
    socket.emit("welcome", { text: "welcome to sockets" });

    socket.on("message", function (data) {
      io.sockets.emit("sendMessage", data);
    });
  });
}

exports.createChat = createChat;