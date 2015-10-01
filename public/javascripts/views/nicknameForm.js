HelloWorldChat.Views.NicknameForm = HelloWorldChat.ModalView.extend({
  initialize: function (options) {
    this._setContent(options);

    this.$modal.addClass('opaque');
    this.$content.addClass('initial');

    this.listenForOnce('connected', this.fillInNickname);
    this.listenForOnce('enterRoom', this.enterRoom);
    this.listenFor('error', this.renderError);
    this.listenFor('success', this.success);
  },

  events: {
    'submit': 'submitNickname',
    'click #modal': 'submitNickname'
  },

  fillInNickname: function (nickname) {
    this.$('input').val(nickname).focus().select();
  },

  submitNickname: function (e) {
    e.preventDefault();

    var nickname = this.$("input").val().trim();
    this.$('.error').empty();

    if (!nickname || this._submitting) { return; }

    this.socket.changeNickname(nickname);
  },

  renderError: function (error) {
    this.$('.error').text(error);
    this.$('input').focus().select();
  },

  enterRoom: function () {
    this.$content.addClass('enter-room');
    this.$('input').blur();

    this.$content.one('transitionend', function () {
      this._fadeOutInput();
      this._resetModal();
    }.bind(this));
  },

  _fadeOutInput: function () {
    this.$('input').addClass('fade-away');

    this.$('input').on('transitionend', function () {
      this.$('h2').remove();
      this.$content.removeClass('enter-room').addClass('hide');
      this.$('input').removeClass('fade-away');
    }.bind(this));
  },

  _resetModal: function () {
    this.fadeOutCover(function () {
      this.$modal.removeClass('opaque');
      this.$content.removeClass('initial').addClass('hide');
    }.bind(this));
  },

  edit: function () {
    this.openCover();
    this.$content.removeClass('hide');
    this.fillInNickname(this.socket.get('nickname'));
  },

  success: function () {
    this.closeCover();
    this.$content.addClass('hide');
  }
});
