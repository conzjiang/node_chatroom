(function (root) {
  $.Carousel = function (el) {
    this.$el = $(el);
    this.activeIdx = 0;
  };

  var PRIVATE_CHAT_WIDTH = 390;
  var MAIN_CHAT_WIDTH = 505;

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
    return this.each(function () {
      new $.Carousel(this);
    });
  };

})(window);
