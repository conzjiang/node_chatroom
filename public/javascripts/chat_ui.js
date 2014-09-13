(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.chat = new NodeFun.Chat(io());
    this.socket = this.chat.socket;
    this.privateChats = [];

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
      var id = $(this).attr("data-id");
      var chatter = $(event.target).text();

      if (ui.privateChats.indexOf(id) === -1) ui.newPrivateChat(id, chatter);
    });

    $(".private-chats").on("click", ".x", function () {
      var $li = $(this).closest("li");
      $li.remove();

      var index = ui.privateChats.indexOf($li.attr("data-id"));
      ui.privateChats.splice(index, 1);
    });

    $(".private-chats").on("submit", "form", function () {
      event.preventDefault();
      var id = $(this).closest("li").attr("data-id");
      ui._handleMessage({ id: id });
    });

    $(".private-chats").on("keydown", "form", function () {
      if (event.which === 13) {
        event.preventDefault();
        var id = $(this).closest("li").attr("data-id");
        ui._handleMessage({ id: id });
      }
    });
  };

  ChatUI.prototype.newPrivateChat = function (id, chatter) {
    this.privateChats.push(id);

    var template = _.template($("#private-chat").html());
    var content = template({ id: id, nickname: chatter });

    $(".private-chats").append(content);
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

    this.socket.on("sendPrivateMessage", function (data) {
      if (!data.self && ui.privateChats.indexOf(data.chatId) === -1) {
        ui.newPrivateChat(data.chatId, data.senderNickname);
      }

      var $convoBox = $(".private-chats > li[data-id='" + data.chatId + "']").find(".convo");
      $convoBox.append("<p><strong>" + data.senderNickname + ":</strong> " + data.text + "</p>");
      $convoBox.scrollTop($convoBox.height());
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

  ChatUI.prototype._handleMessage = function (private) {
    $("p#error").empty();

    var message = $(event.currentTarget).find("textarea").val();

    if (message) {
      var messageText = this._escape(message);

      if (messageText.indexOf("/nick") === 0) {
        this.socket.emit("nicknameChange", {
          nickname: messageText.split("/nick ")[1]
        });
      } else {
        this.chat.sendMessage(messageText, private);
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
      $container.append("<li data-id='" + id + "'>" + nicknames[id] + "</li>");
    }

    $(".private-chats > li").each(function () {
      var id = $(this).attr("data-id");
      $(this).find("h3").html(nicknames[id]);
    });
  };
})(this);