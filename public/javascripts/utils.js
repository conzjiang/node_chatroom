$.fn.scrollToBottom = function () {
  $(this).scrollTop($(this).scrollTop() + $(this).height());
};

$.fn.findByDataId = function (id) {
  return this.filter(function () {
    return $(this).data("id") === id;
  });
};
