NodeFun.Models.Socket = Backbone.Model.extend({
  initialize: function (options) {
    this.socket = options.socket;
    this.lastKeypress = Date.now();
    this.typingInterval;
  },

  emit: function (event, data) {
    this.socket.emit(event, data);
  },

  changeNickname: function (newNickname) {
    this.nickname = newNickname;
    this.socket.emit("nicknameChange", { nickname: newNickname });
  },

  type: function (id) {
    var oneSecondAgo = Date.now() - 1000;
    var interval = this.typingInterval;

    if (this.lastKeypress < oneSecondAgo) {
      this.lastKeypress = Date.now();

      if (!interval) {
        var that = this;
        this.emit("typing", { receiverId: id });
        interval = setInterval(stopTyping, 1000);

        function stopTyping() {
          var oneSecondAgo = Date.now() - 1000;

          if (that.lastKeypress < oneSecondAgo) {
            that.emit("stopTyping", { receiverId: id });
            clearInterval(interval);
            interval = null;
          }
        };
      }
    }
  },

  sendMessage: function (message, receiverId) {
    if (receiverId) {
      this.emit("privateMessage", { id: receiverId, text: message });
    } else {
      this.emit("message", { text: message });
    }
  }
});