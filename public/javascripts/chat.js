(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var Chat = NodeFun.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function (message) {
    this.socket.emit("message", { text: message });
  };
})(this);