HelloWorldChat.ModalView = HelloWorldChat.View.extend({
  _ensureElement: function () {
    Backbone.View.prototype._ensureElement.call(this);
    this.$el.html($('#modal-template').html());
    this.$modal = this.$('#modal');
  },

  _setContent: function (options) {
    this.$el.append($(options.contentTemplate).html());
    this.$content = this.$(options.content);
  },

  openCover: function () {
    $('body').addClass('static');
    this.$modal.removeClass('hide');
  },

  fadeOutCover: function (callback) {
    $('body').removeClass('static');
    this.$modal.addClass('fade-out');

    this.$modal.one('transitionend', function () {
      this.$modal.removeClass('fade-out').addClass('hide');

      if (typeof callback === 'function') { callback(); }
    }.bind(this));
  },

  closeCover: function () {
    $('body').removeClass('static');
    this.$modal.addClass('hide');
  }
});
