(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});

  var HandleMessages = PnB.HandleMessages = function (options) {
    this.socket = options.socket;
    this.allSockets = options.allSockets;

    this.bindEvents();
  };

  HandleMessages.prototype.bindEvents = function () {
    this.socket.on("message", this.sendMessage.bind(this));
    this.socket.on("privateMessage", this.sendPrivateMessage.bind(this));
  };

  HandleMessages.prototype.sendMessage = function (data) {
    this.allSockets.emit("sendMessage", {
      senderId: this.socket.id,
      text: data.text
    });
  };

  HandleMessages.prototype.sendPrivateMessage = function (data) {
    var otherSocketId = data.id;

    this.socket.to(otherSocketId).emit("sendPrivateMessage", {
      chatId: this.socket.id,
      senderId: this.socket.id,
      text: data.text
    });

    this.socket.emit("sendPrivateMessage", {
      chatId: otherSocketId,
      senderId: this.socket.id,
      text: data.text
    });
  };
})(this);
