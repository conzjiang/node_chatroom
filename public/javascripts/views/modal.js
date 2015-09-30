HelloWorldChat.ModalView = HelloWorldChat.View.extend({
  _ensureElement: function () {
    Backbone.View.prototype._ensureElement.call(this);
    this.$el.html($('#modal-template').html());
    this.$el.append($(this.contentTemplate).html());

    this.$modal = this.$('#modal');
    this.$content = this.$(this.contentTemplate);
  },

  openCover: function () {
    $('body').addClass('static');
    this.$modal.removeClass('hide');
  },

  fadeOutCover: function (callback) {
    $('body').removeClass('static');
    this.$modal.addClass('fade-out');

    this.$modal.one('transitionend', function () {
      this.$modal.removeClass('fade-out opaque').addClass('hide');

      if (typeof callback === 'function') { callback(); }
    }.bind(this));
  },

  closeCover: function () {
    $('body').removeClass('static');
    this.$modal.addClass('hide');
  }
});
