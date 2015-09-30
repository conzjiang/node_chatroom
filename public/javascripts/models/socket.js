HelloWorldChat.Models.Socket = Backbone.Model.extend({
  initialize: function (options) {
    this.socket = options.socket;
    this.lastKeypress = Date.now();

    this.beginListening();
  },

  beginListening: function () {
    this.individualEvents();
    this.broadcastedEvents();
  },

  individualEvents: function () {
    this.listenFor('connected', function (data) {
      this.id = data.id;
      this.trigger('connected', data.tempNick);
    });

    this.listenFor('enterRoom', function (data) {
      this.set('nickname', data.nickname);
      this.trigger('enterRoom');
    });

    this.listenFor('errorMessage', function (data) {
      this.trigger('error', data.message);
    });

    this.listenFor('nicknameSuccess', function (data) {
      this.set('nickname', data.nickname);
      this.trigger('success');
    });
  },

  broadcastedEvents: function () {
    this.listenFor('newGuest', this.trigger.bind(this, 'newGuest'));
  },

  emit: function (event, data) {
    this.socket.emit(event, data);
  },

  listenFor: function (event, callback) {
    this.socket.on(event, callback.bind(this));
  },

  changeNickname: function (newNickname) {
    if (this.get('nickname') !== newNickname) {
      this.emit('changeNickname', { nickname: newNickname });
    } else {
      this.trigger('success');
    }
  },

  type: function (id) {
    var oneSecondAgo = Date.now() - 1000;

    if (this.lastKeypress < oneSecondAgo) {
      this.lastKeypress = Date.now();

      if (!this.typingInterval) {
        var that = this;
        this.emit("typing", { receiverId: id });
        this.typingInterval = setInterval(stopTyping, 1000);

        function stopTyping() {
          var oneSecondAgo = Date.now() - 1000;

          if (that.lastKeypress < oneSecondAgo) {
            that.emit("stopTyping", { receiverId: id });
            clearInterval(that.typingInterval);
            that.typingInterval = null;
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