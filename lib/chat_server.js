function createChat(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on("connection", function (socket) {
    socket.emit("welcome", { text: "welcome to sockets" });
  });
}

exports.createChat = createChat;