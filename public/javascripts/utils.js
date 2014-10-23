$.fn.scrollToBottom = function () {
  $(this).scrollTop($(this).scrollTop() + $(this).height());
};

$.fn.removeAndUnbind = function () {
  $(this).off();
  $(this).remove();
};

String.prototype.clean = function () {
  var escapedStr = this.replace(/</g, "&lt;");
  escapedStr = escapedStr.replace(/>/g, "&gt;");

  return $.trim(escapedStr);
};