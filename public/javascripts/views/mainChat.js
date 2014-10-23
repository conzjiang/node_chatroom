NodeFun.Views.MainChat = Backbone.View.extend({
  initialize: function () {
    this.$chat = this.$el.find(".chat-box");
    this.listenTo(NodeFun.socket, "newMessage", this.appendMessage);
  },

  template: function (data) {
    var $templateCode = $("<p>");
    var $nickname = $("<strong class='nickname'>");

    $nickname.data("id", data.id);
    $nickname.html(data.nickname + ": ");
    $templateCode.append($nickname).append(data.message);

    return $templateCode;
  },

  appendMessage: function (data) {
    var content = this.template(data);
    this.$chat.append(content);
  }
});