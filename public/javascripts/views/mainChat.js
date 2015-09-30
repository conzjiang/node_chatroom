HelloWorldChat.Views.MainChat = HelloWorldChat.Views.Chat.extend({
  initialize: function () {
    this.$chat = this.$('.chatroom');
    this.listenFor('newGuest', this.announceNewGuest);
  },

  newGuestTemplate: _.template('\
    <p class="notification"><%= guest.nickname %> has joined the room</p>'),

  announceNewGuest: function (guest) {
    this.appendToChat(this.newGuestTemplate({ guest: guest }));
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
      if (HelloWorldChat.socket.id === id) $nicknameTemplate.addClass("self");

      $container.append($nicknameTemplate);
    }
  }
});