HelloWorldChat.Views.PrivateChat = HelloWorldChat.Views.Chat.extend({
  initialize: function (options) {
    this.chatId = options.chatId;
    this.nickname = options.nickname;
    this.lastKeypress = Date.now();

    this.listenFor('privateMessage', this.appendMessage);
  },

  events: {
    'transitionend': 'focus',
    'click .x': 'closeChat',
    'click': 'go'
  },

  tagName: 'li',
  className: 'chat',

  template: function (options) {
    return _.template($('#private-chat-template').html())(options);
  },

  render: function () {
    this.$el.html(this.template({ nickname: this.nickname }));
    this._setup();

    return this;
  },

  focus: function () {
    this.$input.focus();
  },

  closeChat: function () {
    this.trigger('end', this);
  },

  go: function () {
    if (this.isActive()) { return; }

    this.trigger('go', this.chatId);
  },

  type: function () {
    HelloWorldChat.socket.type(this.chatId);
  },

  showTyping: function (data) {
    this.appendToChat("<p class='typing notif'>" + data.nickname + " is typing</p>");
  },

  stopTyping: function () {
    this.$chat.find(".typing").remove();
  }
});