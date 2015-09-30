HelloWorldChat.Views.NicknameForm = Backbone.View.extend({
  initialize: function (options) {
    this.socket = options.socket;

    this.listenTo(this.socket, 'connected', this.fillInTempNick);
    this.listenTo(this.socket, 'error', this.renderError);
  },

  events: {
    'submit': 'submitNickname',
    'blur input': 'submitNickname'
  },

  fillInTempNick: function (tempNick) {
    this.$('input').val(tempNick).focus().select();
  },

  submitNickname: function (e) {
    e.preventDefault();
    var nickname = this.$("input").val().trim();

    if (!nickname) { return; }

    this.socket.changeNickname(nickname);
  },

  renderError: function (error) {
    this.$('.error').text(error);
  }
});
