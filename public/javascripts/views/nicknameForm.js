HelloWorldChat.Views.NicknameForm = HelloWorldChat.View.extend({
  initialize: function () {
    this.listenForOnce('connected', this.fillInTempNick);
    this.listenForOnce('enterRoom', this.enterRoom);
    this.listenFor('error', this.renderError);
    this.listenFor('success', this.success);
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
    this.$('.error').empty();

    if (!nickname || this._submitting) { return; }

    this._submitting = true; // because submit also triggers blur
    this.socket.changeNickname(nickname);
  },

  renderError: function (error) {
    this._submitting = false;
    this.$('.error').text(error);
  },

  enterRoom: function () {
    this.$el.addClass('enter-room');
    this.$('input').blur();
    this._submitting = false; // because blur above triggers event

    this.$el.one('transitionend', function () {
      this._fadeOutInput();
      this.trigger('enteredRoom');
    }.bind(this));
  },

  _fadeOutInput: function () {
    this.$('input').addClass('fade-away');

    this.$('input').one('transitionend', function () {
      this.$('h2').remove();
      this.$el.removeClass('enter-room').addClass('hide');
      this.$('input').removeClass('fade-away');
    }.bind(this));
  },

  edit: function () {
    this.$el.removeClass('hide');
    this.$('input').focus().select();
  },

  success: function () {
    this._submitting = false;
    this.$el.addClass('hide');
  }
});
