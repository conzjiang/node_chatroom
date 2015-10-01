HelloWorldChat.Views.HelpView = HelloWorldChat.ModalView.extend({
  initialize: function (options) {
    this._setContent(options);
  },

  events: {
    'click .x': 'close',
    'click #modal': 'close'
  },

  render: function () {
    this.openCover();

    setTimeout(function () {
      this.$content.addClass('enter');
    }.bind(this), 0);

    return this;
  },

  close: function () {
    this.$content.addClass('leave');
    this.fadeOutCover();

    this.$content.one('transitionend', this.remove.bind(this));
  }
});
