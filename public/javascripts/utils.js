$.fn.scrollToBottom = function () {
  $(this).scrollTop($(this).scrollTop() + $(this).height());
};

$.fn.removeAndUnbind = function () {
  $(this).off();
  $(this).remove();
};