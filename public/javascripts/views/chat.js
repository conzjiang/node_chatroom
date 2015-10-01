HelloWorldChat.Views.Chat = HelloWorldChat.View.extend({
  _setup: function () {
    this.$chat = this.$('.chatroom');
    this.$input = this.$('.message-input');

    _.extend(this.events, HelloWorldChat.Views.Chat.prototype.events);
  },

  events: {
    "keydown .message-input": "sendMessage"
  },

  appendToChat: function (content) {
    this.$chat.append(content);
    this.$chat.scrollToBottom();
  },

  sendMessage: function (e) {
    if (e.which !== HWCConstants.ENTER) { return; }

    e.preventDefault();
    var message = this.$input.val().trim();

    if (message) {
      this.socket.sendMessage(message, this.chatId);
      this.$input.val("");
    }
  },

  template: function (options) {
    var guest = options.guest;
    var $template = $("<p>");
    var $nickname = $("<strong>");

    $nickname.addClass(guest.senderId).text(guest.nickname);
    $template.text(guest.message).prepend($nickname);

    return $template;
  },

  appendMessage: function (guest) {
    this.$('.typing').remove();

    this.appendToChat(this.template({
      guest: guest
    }));
  }
});
