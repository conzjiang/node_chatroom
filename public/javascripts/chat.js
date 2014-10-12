(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var Chat = NodeFun.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function (message, private) {
    if (private.id) {
      this.socket.emit("privateMessage", { id: private.id, text: message });
    } else {
      this.socket.emit("message", { text: message });
    }
  };
})(this);