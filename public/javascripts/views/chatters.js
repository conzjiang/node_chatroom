HelloWorldChat.Views.Chatters = HelloWorldChat.View.extend({
  initialize: function () {
    this.listenForOnce('enterRoom', this.render);
    this.listenFor('newGuest', this.addToList);
    this.listenFor('guestLeft', this.removeFromList);
  },

  template: _.template('\
    <li class="<%= guest.id %>"><%= guest.nickname %></li>'),

  render: function (nicknames) {
    this.$el.empty();

    for (var id in nicknames) {
      this.addToList({
        id: id,
        nickname: nicknames[id]
      });
    }

    return this;
  },

  addToList: function (guest) {
    var $li = $(this.template({ guest: guest }));

    if (guest.id === this.socket.id) {
      $li.addClass('me');
    }

    this.$el.append($li);
  },

  removeFromList: function (guest) {
    this.$('.' + guest.id).remove();
  }
});
