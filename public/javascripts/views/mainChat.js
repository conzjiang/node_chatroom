NodeFun.Views.MainChat = Backbone.View.extend({
  initialize: function () {
    this.$chat = this.$el.find(".chat-box");
    this.listenTo(NodeFun.socket, "newMessage", this.appendMessage);
    this.listenTo(NodeFun.socket, "newNickname", this.displayNicknames);
  },

  template: function (data) {
    var $templateCode = $("<p>");
    var $nickname = $("<strong class='nickname'>");

    $nickname.data("id", data.id);
    $nickname.html(data.nickname);
    $templateCode.append($nickname).append(": ").append(data.message);

    return $templateCode;
  },

  appendMessage: function (data) {
    var content = this.template(data);
    this.$chat.append(content);
  },

  displayNicknames: function (nicknames) {
    var $container = this.$el.find(".chatters");
    $container.empty();

    for (var id in nicknames) {
      var nickname = nicknames[id];

      var $nicknameTemplate = $("<li class='nickname'>");
      $nicknameTemplate.data("id", id);
      $nicknameTemplate.html(nickname);
      if (NodeFun.socket.id === id) $nicknameTemplate.addClass("self");

      $container.append($nicknameTemplate);
    }
  }
});