HelloWorldChat.Views.NicknameForm = HelloWorldChat.ModalView.extend({
  initialize: function () {
    this.listenForOnce('connected', this.fillInTempNick);
    this.listenForOnce('enterRoom', this.enterRoom);
    this.listenFor('error', this.renderError);
    this.listenFor('success', this.close);
  },

  events: {
    'submit': 'submitNickname',
    'click #modal': 'submitNickname'
  },

  fillInTempNick: function (tempNick) {
    this.$('input').val(tempNick).focus().select();
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
  },

  enterRoom: function () {
    var that = this;

    this.$content.addClass('enter-room');
    this.$('input').blur();

    this.$content.one('transitionend', function () {
      that._fadeOutInput();

      that.fadeOutCover(function () {
        that.$content.addClass('entered');
      });
    });
  },

  _fadeOutInput: function () {
    this.$('input').addClass('fade-away');

    this.$('input').one('transitionend', function () {
      this.$('h2').remove();
      this.$content.removeClass('enter-room').addClass('hide');
      this.$('input').removeClass('fade-away');
    }.bind(this));
  },

  edit: function () {
    this.openCover();
    this.$content.removeClass('hide');
    this.$('input').focus().select();
  },

  close: function () {
    this.closeCover();
    this.$content.addClass('hide');
  }
});
