HelloWorldChat.Views.Chatters = HelloWorldChat.View.extend({
  initialize: function (options) {
    this.socket = options.socket;

    this.listenFor('newGuest', this.addToList);
    this.listenForOnce('enterRoom', this.render);
  },

  template: _.template('\
    <li class="<%= guest.id %>"><%= guest.nickname %></li>'),

  addToList: function (guest) {
    var $li = $(this.template({ guest: guest }));

    if (guest.id === this.socket.id) {
      $li.addClass('me');
    }

    this.$el.append($li);
  },

  render: function (nicknames) {
    this.$el.empty();

    for (var id in nicknames) {
      this.addToList({
        id: id,
        nickname: nicknames[id]
      });
    }

    return this;
  }
});
