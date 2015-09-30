HelloWorldChat.Views.MainChat = HelloWorldChat.Views.Chat.extend({
  initialize: function () {
    this.$chat = this.$('.chatroom');

    this.listenFor('newGuest', this.announceNewGuest);
    this.listenFor('guestLeft', this.announceGuestLeft);
    this.listenFor('publicMessage', this.appendMessage);
  },

  notification: _.template('\
    <p class="notification"><%= notification %></p>'),

  announceNewGuest: function (guest) {
    this.notify(guest.nickname + ' has joined the room');
  },

  announceGuestLeft: function (guest) {
    this.notify(guest.nickname + ' has left the room');
  },

  notify: function (message) {
    this.appendToChat(this.notification({
      notification: message
    }));
  }
});
