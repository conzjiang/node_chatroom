HelloWorldChat.Views.HelpView = HelloWorldChat.View.extend({
  initialize: function () {
    this.stopListening();
  },

  events: {
    "click .x": "close"
  },

  open: function () {
    this.delegateEvents();
    this.$el.addClass('show');

    setTimeout(function () {
      this.$el.addClass('enter');
    }.bind(this), 0);
  },

  close: function () {
    this.stopListening();
    this.$el.addClass('leave');

    this.$el.one('transitionend', function () {
      $(this).removeClass('show enter leave');
    });
  }
});
