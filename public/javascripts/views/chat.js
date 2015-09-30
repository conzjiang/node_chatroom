HelloWorldChat.Views.Chat = Backbone.View.extend({
  events: {
    "keydown form": "sendMessage"
  },

  appendToChat: function (content) {
    this.$chat.append(content);
    this.$chat.scrollToBottom();
  },

  sendMessage: function (e) {
    var $textarea = this.$el.find("textarea");

    if (e.which === 13) {
      e.preventDefault();
      var message = $textarea.val().clean();
      var receiverId = $(e.currentTarget).closest("li.chat").data("id");

      if (message) {
        HelloWorldChat.socket.sendMessage(message, receiverId);
        $textarea.val("");
      }
    }
  },

  template: function (data) {
    var $templateCode = $("<p>");
    var $nickname = $("<strong class='nickname'>");

    $nickname.data("id", data.id);
    $nickname.html(data.nickname);
    $templateCode.append($nickname).append(": " + data.message);

    return $templateCode;
  },

  appendMessage: function (data) {
    var content = this.template(data);
    this.$chat.find(".typing").remove();
    this.appendToChat(content);
  }
});