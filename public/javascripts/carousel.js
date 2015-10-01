(function (root) {
  var PRIVATE_CHAT_WIDTH = HWCConstants.PRIVATE_CHAT_WIDTH;
  var MAIN_CHAT_WIDTH = HWCConstants.MAIN_CHAT_WIDTH;

  var CAROUSEL_HELPERS = {
    items: [],

    addKey: function (key) {
      this.items.push(key);
    },

    hasKey: function (key) {
      return this.indexOf(key) !== -1;
    },

    scrollTo: function (key) {
      this.$carousel.scrollTo(this.indexOf(key));
    },

    removeKey: function (key) {
      this.items.splice(this.indexOf(key), 1);
    },

    indexOf: function (key) {
      return this.items.indexOf(key);
    }
  };

  $.Carousel = function ($el) {
    this.$el = $el;
    this.$left = $(this.$el.data('left-button'));
    this.$right = $(this.$el.data('right-button'));
    this.activeIdx = 0;

    this.$left.on('click', this.slideRight.bind(this));
    this.$right.on('click', this.slideLeft.bind(this));
  };

  $.Carousel.prototype.slideLeft = function (e) {
    this.slide(1);
  };

  $.Carousel.prototype.slideRight = function (e) {
    this.slide(-1);
  };

  $.Carousel.prototype.slide = function (dir) {
    var leftShift, $items, $currentItem, $nextItem, operator;

    if (this.activeIdx === 0 || this.activeIdx + dir === 0) {
      leftShift = MAIN_CHAT_WIDTH;
    } else {
      leftShift = PRIVATE_CHAT_WIDTH;
    }

    $items = this.$el.children();
    $currentItem = $items.eq(this.activeIdx);
    this.activeIdx = (this.activeIdx + dir + $items.length) % $items.length;
    $nextItem = $items.eq(this.activeIdx);
    operator = dir < 0 ? "+" : "-";

    this.$el.css({
      left: operator + '=' + leftShift + 'px'
    });

    $currentItem.removeClass('active');
    $nextItem.addClass('active');
    this.updateButtons();
  };

  $.Carousel.prototype.updateButtons = function () {
    this.$left.prop('disabled', this.activeIdx === 0);
    this.$right.prop('disabled', this.activeIdx === this.$el.items.length - 1);
  };

  $.Carousel.prototype.scrollTo = function (index) {
    this.slide(index - this.activeIdx);
  };

  $.fn.carousel = function () {
    $.extend(this, CAROUSEL_HELPERS);
    this.$carousel = new $.Carousel(this);

    return this;
  };

})(window);
