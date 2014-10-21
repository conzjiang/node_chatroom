function createChat(server) {
  var io = require('socket.io').listen(server);
  var guestNumber = 1;
  var nicknames = {};

  io.on("connection", function (socket) {
    var enteredRoom = false;

    // NICKNAMES
    var nickname = "guest" + guestNumber;
    guestNumber++;

    socket.emit("connected", { nickname: nickname });

    var enterRoom = function () {
      enteredRoom = true;
      socket.emit("chatReady");

      socket.broadcast.emit("newGuest", {
        nickname: nickname,
        id: socket.id
      });
    };

    socket.on("nicknameChange", function (data) {
      var alreadyTaken = false;

      for (var id in nicknames) {
        if (nicknames[id] === data.nickname) alreadyTaken = true;
      }

      if (alreadyTaken) {
        socket.emit("errorMessage", {
          message: "'" + data.nickname + "' is already taken. Please pick another nickname."
        });
      } else {
        nickname = nicknames[socket.id] = data.nickname;

        if (data.newGuest) {
          enterRoom();
        } else {
          socket.emit("nicknameAdded", { nickname: nickname });
        }

        io.emit("displayNicks", { nicknames: nicknames, changedId: socket.id });
      }
    });

    // MESSAGES
    socket.on("message", function (data) {
      io.sockets.emit("sendMessage", {
        senderId: socket.id,
        senderNickname: nickname,
        text: data.text
      });
    });

    socket.on("privateMessage", function (data) {
      socket.to(data.id).emit("sendPrivateMessage", {
        chatId: socket.id,
        senderId: socket.id,
        senderNickname: nickname,
        text: data.text
      });

      socket.emit("sendPrivateMessage", {
        chatId: data.id,
        senderId: socket.id,
        senderNickname: nickname,
        text: data.text,
        self: true
      });
    });

    // TYPING
    socket.on("typing", function (data) {
      socket.to(data.receiverId).emit("isTyping", {
        nickname: nickname,
        id: socket.id
      });
    });

    socket.on("stopTyping", function (data) {
      socket.to(data.receiverId).emit("stoppedTyping", { id: socket.id });
    });

    socket.on("disconnect", function () {
      if (enteredRoom) {
        socket.broadcast.emit("guestLeft", {
          nickname: nickname,
          id: socket.id
        });

        delete nicknames[socket.id];
      }
    });
  });
}

exports.createChat = createChat;