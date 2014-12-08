$.Carousel = function ($el) {
  this.$el = $el;
  this.$items = this.$el.children();
  this.activeIdx = 0;

  $(".left").on("click", this.slideLeft.bind(this));
  $(".right").on("click", this.slideRight.bind(this));
};

var setButtons = function (carousel) {
  $(".buttons").children().each(function () {
    $(this).removeClass("inactive");
  });

  if (carousel.activeIdx === 0) {
    $(".right").addClass("inactive");
  }

  if (carousel.activeIdx === carousel.$items.length - 1) {
    $(".left").addClass("inactive");
  }
};

$.Carousel.prototype.slide = function (dir) {
  var operator = dir < 0 ? "+" : "-";
  var $currentItem = this.$items.eq(this.activeIdx);
  var leftPos, $nextItem;

  this.activeIdx =
    (this.activeIdx + dir + this.$items.length) % this.$items.length;

  $nextItem = this.$items.eq(this.activeIdx);
  leftPos = Math.abs(dir) * 400;
  if ($currentItem.hasClass("main-chat") || $nextItem.hasClass("main-chat")) {
    leftPos += 200;
  }

  this.$el.animate({ "margin-left": operator + "=" + leftPos + "px" });
  $nextItem.addClass("active");
  $currentItem.removeClass("active");
  setButtons(this);
};

$.Carousel.prototype.slideLeft = function (e) {
  if (!$(e.currentTarget).hasClass("inactive")) { this.slide(1); }
};

$.Carousel.prototype.slideRight = function (e) {
  if (!$(e.currentTarget).hasClass("inactive")) { this.slide(-1); }
};

$.Carousel.prototype.updateItems = function () {
  this.$items = this.$el.children();
};

$.Carousel.prototype.scrollTo = function (index) {
  this.slide(index - this.activeIdx);
};

$.fn.carousel = function () {
  return new $.Carousel($(this));
};