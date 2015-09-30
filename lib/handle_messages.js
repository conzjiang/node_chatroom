var HandleMessages = function (options) {
  this.socket = options.socket;
  this.allSockets = options.allSockets;
  this.nicknames = options.nicknameManager;

  this.bindEvents();
};

HandleMessages.prototype.bindEvents = function () {
  this.socket.on("sendPublicMessage", this.broadcastMessage.bind(this));
  this.socket.on("sendPrivateMessage", this.sendPrivateMessage.bind(this));
};

HandleMessages.prototype.broadcastMessage = function (data) {
  this.allSockets.emit("publicMessage", {
    senderId: this.socket.id,
    nickname: this.nicknames.get(this.socket.id),
    message: data.message
  });
};

HandleMessages.prototype.sendPrivateMessage = function (data) {
  var otherSocketId = data.id;

  this.socket.to(otherSocketId).emit("privateMessage", {
    chatId: this.socket.id,
    senderId: this.socket.id,
    nickname: this.nicknames.get(this.socket.id),
    message: data.message
  });

  this.socket.emit("privateMessage", {
    chatId: otherSocketId,
    senderId: this.socket.id,
    nickname: this.nicknames.get(this.socket.id),
    message: data.message
  });
};

module.exports = HandleMessages;
