(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});

  var Socket = PnB.Socket = function (socket) {
    this.socket = socket;
  };

  _.extend(Socket.prototype, {
    emit: function (event, data) {
      this.socket.emit(event, data);
    },

    on: function (event, callback) {
      this.socket.on(event, callback);
    },

    changeNickname: function (nickname) {
      this.emit('nicknameChange', {
        nickname: nickname
      });
    }
  });

  PnB.socket = new Socket(io());
})(this);
