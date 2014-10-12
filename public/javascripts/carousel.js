$.Carousel = function ($el) {
  this.$el = $el;
  this.$items = this.$el.find("li");
  this.activeIdx = 0;

  $(".left").on("click", this.slideLeft.bind(this));
  $(".right").on("click", this.slideRight.bind(this));
};

$.Carousel.prototype.slide = function (dir) {
  var operator = dir === -1 ? "+" : "-";

  var $currentItem = this.$items.eq(this.activeIdx);
  this.activeIdx =
    (this.activeIdx + dir + this.$items.length) % this.$items.length;
  var $nextItem = this.$items.eq(this.activeIdx);

  var leftPos = 300;
  if ($currentItem.hasClass("main-chat") || $nextItem.hasClass("main-chat")) {
    leftPos = 400;
  }

  this.$el.animate({
    left: operator + "=" + leftPos + "px"
  }, 100, function () {
    $nextItem.addClass("active");
    $currentItem.removeClass("active");
  });
};

$.Carousel.prototype.slideLeft = function (e) {
  this.slide(1);
};

$.Carousel.prototype.slideRight = function (e) {
  this.slide(-1);
};

$.fn.carousel = function () {
  return this.each(function () {
    new $.Carousel($(this));
  });
};

$(function () {
  $(".all-chats").carousel();
});