HelloWorldChat.Views.PrivateChat = HelloWorldChat.Views.Chat.extend({
  initialize: function (options) {
    this.chatId = options.chatId;
    this.nickname = options.nickname;
    this.lastKeypress = Date.now();
  },

  events: {
    "transitionend": "focus",
    "click .x": "closeChat",
    "keypress form": "type"
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

  isActive: function () {
    return this.$el.hasClass('active');
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