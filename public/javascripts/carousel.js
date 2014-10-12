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
  var operator = dir === -1 ? "+" : "-";

  var $currentItem = this.$items.eq(this.activeIdx);
  this.activeIdx =
    (this.activeIdx + dir + this.$items.length) % this.$items.length;
  var $nextItem = this.$items.eq(this.activeIdx);

  var leftPos = 300;
  if ($currentItem.hasClass("main-chat") || $nextItem.hasClass("main-chat")) {
    leftPos = 550;
  }

  this.$el.animate({
    left: operator + "=" + leftPos + "px"
  }, 100, function () {
    $nextItem.addClass("active");
    $currentItem.removeClass("active");
  });

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

$.Carousel.prototype.scrollToEnd = function () {
  var $currentItem = this.$items.eq(this.activeIdx);
  var scrollPos = (this.$items.length - 1 - this.activeIdx) * 300;
  if (this.activeIdx === 0) scrollPos += 250;

  this.$el.animate({ left: "-=" + scrollPos + "px" });
  this.activeIdx = this.$items.length - 1;

  var $newItem = this.$items.eq(this.activeIdx);
  $newItem.addClass("active");
  $currentItem.removeClass("active");

  $(".right").removeClass("inactive");
  $(".left").addClass("active");
};

$.fn.carousel = function () {
  return new $.Carousel($(this));
};