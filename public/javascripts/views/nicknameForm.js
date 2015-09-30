HelloWorldChat.Views.NicknameForm = Backbone.View.extend({
  initialize: function (options) {
    this.socket = options.socket;

    this.listenTo(this.socket, 'connected', this.fillInTempNick);
    this.listenTo(this.socket, 'error', this.renderError);
    this.listenTo(this.socket, 'enterRoom', this.enterRoom);
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
  },

  enterRoom: function () {
    this.$el.addClass('enter-room');
    this.$('input').blur();

    this.$el.one('transitionend', function () {
      this.fadeOutInput();
      this.trigger('enteredRoom');
    }.bind(this));
  },

  fadeOutInput: function () {
    this.$('input').addClass('fade-away');

    this.$('input').one('transitionend', function () {
      this.$('h2').remove();
      this.$el.removeClass('enter-room').addClass('hide');
      this.$('input').removeClass('fade-away');
    }.bind(this));
  }
});
