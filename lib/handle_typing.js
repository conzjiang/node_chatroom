var HandleTyping = function (options) {
  this.socket = options.socket;
  this.bindEvents();
};

HandleTyping.prototype.bindEvents = function () {
  this.socket.on("typing", this.isTyping.bind(this));
  this.socket.on("stopTyping", this.stopTyping.bind(this));
};

HandleTyping.prototype.isTyping = function (data) {
  this.socket.to(data.receiverId).emit("isTyping", {
    id: this.socket.id
  });
};

HandleTyping.prototype.stopTyping = function (data) {
  this.socket.to(data.receiverId).emit("stoppedTyping", {
    id: this.socket.id
  });
};

module.exports = HandleTyping;
