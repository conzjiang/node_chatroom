HelloWorldChat.Views.MainChat = HelloWorldChat.Views.Chat.extend({
  initialize: function () {
    this._setup();

    this.listenFor('enterRoom', this.focus);
    this.listenFor('newGuest', this.announceNewGuest);
    this.listenFor('guestLeft', this.announceGuestLeft);
    this.listenFor('publicMessage', this.appendMessage);
  },

  announceNewGuest: function (guest) {
    this.notify(guest.nickname + ' has joined the room');
  },

  announceGuestLeft: function (guest) {
    this.notify(guest.nickname + ' has left the room');
  }
});
