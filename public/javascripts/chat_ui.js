(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.chat = new NodeFun.Chat(io());
    this.socket = this.chat.socket;

    this.bindEvents();
  }

  ChatUI.prototype.bindEvents = function () {
    var ui = this;

    this.socket.on("welcome", function (data) {
      $(".chat-box").append("<p>" + data.text + "</p>");
    });

    $("#chat-form").on("submit", function () {
      event.preventDefault();
      ui._handleMessage();
    });

    this.socket.on("sendMessage", function (data) {
      $(".chat-box").append("<p>" + data.text + "</p>");
    });
  };

  ChatUI.prototype._handleMessage = function () {
    var message = $(event.currentTarget).find("textarea").val();
    var messageText = this._escape(message);

    this.chat.sendMessage(messageText);

    $(event.currentTarget).find("textarea").val("");
  };

  ChatUI.prototype._escape = function (message) {
    var msg;

    try {
      msg = $(message).text();
    }
    catch(e) {
      msg = message;
    }

    return msg ? msg : message;
  };
})(this);