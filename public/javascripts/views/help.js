NodeFun.Views.Help = Backbone.View.extend({
  events: {
    "click .help": "showModal",
    'click #help-modal': 'hideModal'
  },

  showModal: function () {
    var $modal = this.$('.help-info');
    this.$el.addClass('help');
    setTimeout(function () {
      $modal.addClass('slide-in');
    }, 0);
  },

  hideModal: function () {
    var $footer = this.$el;
    var $modal = this.$('.help-info');
    var $modalBg = this.$('#help-modal');
    var els = [$modal, $modalBg];

    _(els).each(function($el) { $el.addClass('fade-out'); });

    setTimeout(function () {
      _(els).each(function($el) { $el.addClass('fading-out'); });

      $modalBg.one('transitionend', function () {
        $footer.removeClass('help');
        $modal.removeClass('slide-in');
        _(els).each(function($el) { $el.removeClass('fade-out fading-out'); });
      });
    }, 0);
  }
});