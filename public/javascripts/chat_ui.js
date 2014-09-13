(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.chat = new NodeFun.Chat(io());
    this.socket = this.chat.socket;

    this.bindEvents();
  }

  ChatUI.prototype.bindEvents = function () {
    this.displayMessages();
    this.checkTyping();

    var ui = this;

    $("#chat-form").on("keydown", function (event) {
      if (event.which === 13) {
        event.preventDefault();
        ui._handleMessage();
      }
    });

    $("#chat-form").on("submit", function () {
      event.preventDefault();
      ui._handleMessage();
    });

    // PRIVATE CHATS
    $(".chatters > ul").on("dblclick", "li", function () {
      if (!$(event.target).hasClass("in-chat")) {
        $(event.target).addClass("in-chat");
        var chatter = $(event.target).text();

        var template = _.template($("#private-chat").html());
        var content = template({ nickname: chatter });

        $(".private-chats").append(content);
      }
    });

    $(".private-chats").on("click", ".x", function () {
      $(this).closest("li").remove();
    });
  };

  ChatUI.prototype.displayMessages = function () {
    var ui = this;

    this.socket.on("welcome", function (data) {
      $(".chat-box").append("<p>" + data.text + "</p>");
    });

    this.socket.on("newGuest", function (data) {
      $(".chat-box").append("<p><em>" + data.nickname + " has joined the room</em></p>");
      $(".chatters > ul").append("<li>" + data.nickname + "</li>");
      $(".chat-box").scrollTop($(".chat-box").height());
    });

    this.socket.on("sendMessage", function (data) {
      $("#typing").remove();
      ui._isTyping = false;

      $(".chat-box").append("<p><strong>" + data.nickname + ":</strong> " + data.text + "</p>");
      $(".chat-box").scrollTop($(".chat-box").height());
    });

    this.socket.on("nicknameAdded", function (data) {
      $("p#nickname").html("logged in as " + data.nickname);
      ui.displayNicknames(data.nicknames);
    });

    this.socket.on("displayNicks", function (data) {
      ui.displayNicknames(data.nicknames);
    });

    this.socket.on("guestLeft", function (data) {
      $(".chat-box").append("<p><em>" + data.nickname + " has left the room</em></p>");
    });

    this.socket.on("errorMessage", function (data) {
      $("p#error").html(data.message);
    });
  };

  ChatUI.prototype._handleMessage = function () {
    $("p#error").empty();

    var message = $(event.currentTarget).find("textarea").val();

    if (message) {
      var messageText = this._escape(message);

      if (messageText.indexOf("/nick") === 0) {
        this.socket.emit("nicknameChange", { nickname: messageText.split("/nick ")[1] });
      }
      else {
        this.chat.sendMessage(messageText);
      }

      $(event.currentTarget).find("textarea").val("");
    }
  };

  ChatUI.prototype._escape = function (message) {
    var msg = message.replace(/</g, "&lt;");
    msg = msg.replace(/>/g, "&gt;");

    return msg;
  };

  ChatUI.prototype.checkTyping = function () {
    var ui = this;
    this._isTyping = false;
    this._stoppedTyping = true;

    $("#chat-form").on("keypress", function () {
      ui._stoppedTyping = false;

      if ($(event.currentTarget).find("textarea").val()[0] === "/") {
        ui.socket.emit("stopTyping");
      }
      else if (!ui._isTyping) {
        ui.socket.emit("typing");
        ui._isTyping = true;

        setTimeout(function () {
          if (ui._stoppedTyping) {
            ui._isTyping = false;
            ui.socket.emit("stopTyping");
          }
        }, 3000);
      }
    });

    $("#chat-form").on("keyup", function () {
      ui._stoppedTyping = true;
    });

    this.socket.on("isTyping", function (data) {
      $(".chat-box").append("<p id='typing'><em>" + data.nickname + " is typing</em></p>");
      $(".chat-box").scrollTop($(".chat-box").height());
    });

    this.socket.on("stoppedTyping", function () {
      $("#typing").remove();
    });
  };

  ChatUI.prototype.displayNicknames = function (nicknames) {
    var $container = $(".chatters > ul");
    $container.empty();

    for (var id in nicknames) {
      $container.append("<li>" + nicknames[id] + "</li>");
    }
  };
})(this);