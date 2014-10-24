$.fn.scrollToBottom = function () {
  $(this).scrollTop($(this).scrollTop() + $(this).height());
};

$.fn.findByDataId = function (id) {
  return this.filter(function () {
    return $(this).data("id") === id;
  });
};

String.prototype.clean = function () {
  var escapedStr = this.replace(/</g, "&lt;");
  escapedStr = escapedStr.replace(/>/g, "&gt;");

  return $.trim(escapedStr);
};