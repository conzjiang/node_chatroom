HelloWorldChat.Views.PrivateChat = HelloWorldChat.Views.Chat.extend({
  initialize: function (options) {
    this.chatId = options.chatId;
    this.nickname = options.nickname;
    this.lastKeypress = Date.now();

    this.$el.data('id', this.chatId);

    this.listenFor('privateMessage:' + this.chatId, this.appendMessage);
    this.listenFor('isTyping:' + this.chatId, this.showTyping);
    this.listenFor('stoppedTyping:' + this.chatId, this.stopTyping);
  },

  events: {
    'transitionend': 'focus',
    'keypress': 'type'
  },

  tagName: 'li',
  className: 'chat',

  template: function (options) {
    return _.template($('#private-chat-template').html())(options);
  },

  render: function () {
    this.$el.html(this.template({
      id: this.chatId,
      nickname: this.nickname
    }));

    this._setup();

    return this;
  },

  appendMessage: function () {
    this.stopTyping();
    HelloWorldChat.Views.Chat.prototype.appendMessage.apply(this, arguments);
  },

  type: function (id) {
    if (this.typing || this.lastKeypress > HWCConstants.ONE_SECOND_AGO()) {
      return;
    }

    this.lastKeypress = Date.now();
    this.socket.type(this.chatId);
    this.typing = setInterval(this.checkStopTyping.bind(this), 1000);
  },

  checkStopTyping: function () {
    if (this.lastKeypress > HWCConstants.ONE_SECOND_AGO()) { return; }

    this.socket.stopTyping(this.chatId);
    clearInterval(this.typing);
    this.typing = null;
  },

  showTyping: function () {
    this.notify(this.nickname + ' is typing', { className: 'typing' });
  },

  stopTyping: function () {
    this.$(".typing").remove();
  },

  disconnect: function () {
    this.$el.html('<strong class="disconnect">' +
      this.nickname + ' has left the building</strong>');
  }
});
