function createChat(server) {
  var io = require('socket.io').listen(server);
  var guestNumber = 1;
  var nicknames = {};

  io.on("connection", function (socket) {
    // NICKNAMES
    nicknames[socket.id] = "guest" + guestNumber;
    var nickname = nicknames[socket.id];
    guestNumber++;

    socket.emit("nicknameAdded", {
      nickname: nickname,
      nicknames: nicknames
    });

    socket.broadcast.emit("newGuest", { nickname: nickname });

    socket.on("nicknameChange", function (data) {
      var alreadyTaken = false;

      for (var id in nicknames) {
        if (nicknames[id] === data.nickname) {
          alreadyTaken = true;
        }
      }

      if (alreadyTaken) {
        socket.emit("errorMessage", {
          message: "'" + data.nickname + "' is already taken. Please pick another nickname."
        });
      } else {
        nicknames[socket.id] = data.nickname;
        nickname = nicknames[socket.id];

        socket.emit("nicknameAdded", {
          nickname: nickname,
          nicknames: nicknames
        });
        socket.broadcast.emit("displayNicks", { nicknames: nicknames });
      }
    });

    // MESSAGES
    socket.on("message", function (data) {
      io.sockets.emit("sendMessage", {
        nickname: nickname,
        text: data.text
      });
    });

    socket.on("privateMessage", function (data) {
      socket.to(data.id).emit("sendPrivateMessage", {
        chatId: socket.id,
        senderNickname: nickname,
        text: data.text
      });

      socket.emit("sendPrivateMessage", {
        chatId: data.id,
        senderNickname: nickname,
        text: data.text,
        self: true
      });
    });

    // TYPING
    socket.on("typing", function () {
      socket.broadcast.emit("isTyping", { nickname: nickname });
    });

    socket.on("stopTyping", function () {
      socket.broadcast.emit("stoppedTyping");
    });

    socket.on("disconnect", function () {
      socket.broadcast.emit("guestLeft", {
        nickname: nickname,
        id: socket.id
      });

      delete nicknames[socket.id];
    });
  });
}

exports.createChat = createChat;