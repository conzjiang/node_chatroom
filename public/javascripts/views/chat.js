HelloWorldChat.Views.Chat = HelloWorldChat.View.extend({
  _setup: function () {
    this.$chat = this.$('.chatroom');
    this.$input = this.$('.message-input');

    _.extend(this.events, HelloWorldChat.Views.Chat.prototype.events);
    this.delegateEvents();
  },

  events: {
    "keydown .message-input": "sendMessage"
  },

  focus: function () {
    this.$input.focus();
  },

  appendToChat: function (content) {
    this.$chat.append(content);
    this.$chat.scrollToBottom();
  },

  notification: _.template('\
    <p class="notification"><%= notification %></p>'),

  notify: function (message, options) {
    this.appendToChat(this.notification({
      notification: message
    }));

    if (options) {
      this.$('.notification').last().addClass(options.className);
    }
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

  messageTemplate: function (options) {
    var guest = options.guest;
    var $template = $("<p>");
    var $nickname = $("<strong>");

    $nickname.addClass(guest.senderId).text(guest.nickname);
    $template.text(guest.message).prepend($nickname);

    return $template;
  },

  appendMessage: function (guest) {
    this.appendToChat(this.messageTemplate({
      guest: guest
    }));
  },

  isActive: function () {
    return this.$el.hasClass('active');
  }
});
