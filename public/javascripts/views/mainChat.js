NodeFun.Views.MainChat = NodeFun.Views.Chat.extend({
  initialize: function () {
    this.$chat = this.$el.find(".chat-box");
    this.listenTo(NodeFun.socket, "newGuest", this.newGuest);
    this.listenTo(NodeFun.socket, "newMessage", this.appendMessage);
    this.listenTo(NodeFun.socket, "newNickname", this.displayNicknames);
  },

  newGuest: function (guest) {
    this.appendToChat("<p class='notif'>" + guest + " has joined the room</p>");
  },

  displayNicknames: function (nicknames) {
    var $container = this.$el.find(".chatters");
    $container.empty();

    for (var id in nicknames) {
      var nickname = nicknames[id];

      var $nicknameTemplate = $("<li class='nickname'>");
      $nicknameTemplate.data("id", id);
      $nicknameTemplate.html(nickname);
      $nicknameTemplate.append("<span class='notif'>");
      if (NodeFun.socket.id === id) $nicknameTemplate.addClass("self");

      $container.append($nicknameTemplate);
    }
  }
});