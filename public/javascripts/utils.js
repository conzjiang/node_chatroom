$.fn.scrollToBottom = function () {
  $(this).scrollTop($(this).scrollTop() + $(this).height());
};

$.fn.removeAndUnbind = function () {
  $(this).off();
  $(this).remove();
};

String.prototype.escape = function () {
  var escapedStr = this.replace(/</g, "&lt;");
  escapedStr = escapedStr.replace(/>/g, "&gt;");

  return escapedStr;
};