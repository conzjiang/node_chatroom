(function (root) {
  var PRIVATE_CHAT_WIDTH = 390;
  var MAIN_CHAT_WIDTH = 505;
  var CAROUSEL_HELPERS = {
    items: [],

    addKey: function (key) {
      this.items.push(key);
    },

    scrollTo: function (key) {
      this.$carousel.scrollTo(this.items.indexOf(key));
    },

    removeKey: function (key) {
      this.items.splice(this.items.indexOf(key), 1);
    }
  };

  $.Carousel = function (el) {
    this.$el = $(el);
    this.activeIdx = 0;
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
  };

  $.Carousel.prototype.scrollTo = function (index) {
    this.slide(index - this.activeIdx);
  };

  $.fn.carousel = function () {
    var that = this;
    $.extend(this, CAROUSEL_HELPERS);

    return this.each(function () {
      that.$carousel = new $.Carousel(this);
    });
  };

})(window);
