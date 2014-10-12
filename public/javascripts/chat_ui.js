(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.chat = new NodeFun.Chat(io());
    this.socket = this.chat.socket;
    this.nickname;
    this.privateChats = [];
    this.$chatCarousel = $(".all-chats").carousel();

    this.bindEvents();
  };

  $.fn.scrollToBottom = function () {
    $(this).scrollTop($(this).scrollTop() + $(this).height());
  };

  ChatUI.prototype.bindEvents = function () {
    this.displayMessages();
    this.checkTyping();

    var ui = this;

    $(".all-chats").on("keydown", "form", function (e) {
      if (event.which === 13) {
        event.preventDefault();
        var id = $(this).closest("li").attr("data-id");
        ui._handleMessage($(e.target), { id: id });
      }
    });

    // PRIVATE CHATS
    $(".chatters").on("click", "li", function () {
      var id = $(this).attr("data-id");
      var chatter = $(event.target).text();
      var index = ui.privateChats.indexOf(id);

      if (index === -1) {
        ui.newPrivateChat(id, chatter);
      } else {
        ui.$chatCarousel.scrollTo(index + 1);
      }
    });

    $(".all-chats").on("click", ".x", function () {
      var $chat = $(this).closest("li");
      $chat.remove();

      var index = ui.privateChats.indexOf($chat.attr("data-id"));
      ui.privateChats.splice(index, 1);

      ui.$chatCarousel.updateItems();
      ui.$chatCarousel.slideRight(event);
    });
  };

  ChatUI.prototype.newPrivateChat = function (id, chatter) {
    this.privateChats.push(id);

    var template = _.template($("#private-chat").html());
    var content = template({ id: id, nickname: chatter });

    $(".all-chats").append(content);
    this.$chatCarousel.updateItems();
    this.$chatCarousel.scrollTo($(".all-chats").children().length - 1);
  };

  ChatUI.prototype.displayMessages = function () {
    var ui = this;

    this.socket.on("connected", function (data) {
      ui.nickname = data.nickname;
      $("h1.nickname").html(ui.nickname);
    });

    this.socket.on("newGuest", function (data) {
      $(".chat-box").append("<p><em>" + data.nickname + " has joined the room</em></p>");
      $(".chatters").append("<li data-id=" + data.id + ">" + data.nickname + "</li>");
      $(".chat-box").scrollToBottom();
    });

    this.socket.on("sendMessage", function (data) {
      $("#typing").remove();
      ui._isTyping = false;

      $(".chat-box").append("<p><strong>" + data.nickname + ":</strong> " + data.text + "</p>");
      $(".chat-box").scrollToBottom();
    });

    this.socket.on("sendPrivateMessage", function (data) {

      if (!data.self && ui.privateChats.indexOf(data.chatId) === -1) {
        ui.newPrivateChat(data.chatId, data.senderNickname);
      }

      var $convoBox = $(".all-chats > li[data-id='" + data.chatId + "']").find(".convo");
      $convoBox.append("<p><strong>" + data.senderNickname + ":</strong> " + data.text + "</p>");
      $convoBox.scrollToBottom();
    });

    this.socket.on("nicknameAdded", function (data) {
      $("h1.nickname").html(data.nickname);
      ui.displayNicknames(data.nicknames);
    });

    this.socket.on("displayNicks", function (data) {
      ui.displayNicknames(data.nicknames);

      var $chatter = $(".chatters > li[data-id=" + data.changedId + "]");
      $chatter.addClass("changed");

      setTimeout(function () {
        $chatter.removeClass("changed");
      }, 1000);
    });

    this.socket.on("guestLeft", function (data) {
      $(".chat-box").append("<p><em>" + data.nickname + " has left the room</em></p>");

      var privateIndex = ui.privateChats.indexOf(data.id);

      if (privateIndex !== -1) {
        var $privateChat = $(".all-chats > li[data-id=" + data.id + "]")
        $privateChat.html("<p class='guest-left'>" + data.nickname + " has left the building</p>");

        setTimeout(function () {
          $privateChat.remove();
          ui.privateChats.splice(privateIndex, 1);
          ui.$chatCarousel.updateItems();

          if (ui.$chatCarousel.activeIdx === privateIndex + 1) {
            ui.$chatCarousel.scrollTo(privateIndex);
          }
        }, 2000);
      }

      $(".chatters > li[data-id=" + data.id + "]").remove();
    });

    this.socket.on("errorMessage", function (data) {
      $("p#error").html(data.message);
    });
  };

  ChatUI.prototype._handleMessage = function ($textarea, private) {
    $("p#error").empty();

    var message = $textarea.val();

    if (message) {
      var messageText = this._escape(message);

      if (messageText.indexOf("/nick") === 0) {
        var newNickname = messageText.split("/nick ")[1];

        this.socket.emit("nicknameChange", {
          nickname: newNickname
        });

        this.nickname = newNickname;
      } else {
        this.chat.sendMessage(messageText, private);
      }

      $textarea.val("");
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
      } else if (!ui._isTyping) {
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
      $(".chat-box").scrollToBottom();
    });

    this.socket.on("stoppedTyping", function () {
      $("#typing").remove();
    });
  };

  ChatUI.prototype.displayNicknames = function (nicknames) {
    var $container = $(".chatters");
    $container.empty();

    for (var id in nicknames) {
      $container.append("<li data-id='" + id + "'>" + nicknames[id] + "</li>");

      if (nicknames[id] === this.nickname) {
        $container.children().last().addClass("self");
      }
    }

    $(".all-chats").children().each(function () {
      var id = $(this).attr("data-id");
      if (id) { $(this).find("h3").html(nicknames[id]); }
    });
  };
})(this);