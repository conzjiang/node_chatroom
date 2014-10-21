(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.chat = new NodeFun.Chat(io());
    this.socket = this.chat.socket;
    this.nickname;
    this.privateChats = [];
    this.$chatCarousel = $(".all-chats").carousel();

    this.connect();
  };

  ChatUI.prototype.connect = function () {
    var ui = this;

    this.socket.on("connected", function (data) {
      var $input = $("header input[type=text]");
      $input.val(data.nickname);
      $input.focus().select();
    });

    $("form.change-nickname").on("submit.connected", function (e) {
      e.preventDefault();
      var nickname = $(this).find("input").val();

      if (nickname) {
        ui.nickname = nickname;

        ui.socket.emit("nicknameChange", {
          nickname: nickname,
          newGuest: true
        });
      }
    });

    this.socket.on("chatReady", function () {
      ui.bindEvents();
      $("p.error").empty();

      var $form = $("header.connected > form.change-nickname");
      $form.blur();
      $form.find("h2").fadeOut(1000, $.fn.remove.bind($form.find("h2")));

      $form.animate({ top: "-26px" }, 1000, function () {
        // adjust position after h2 fades out
        $form.css({ top: "20px" }).addClass("ready").off("submit.connected");
        $("h1.nickname").css({ display: "block" }).html(ui.nickname);

        setTimeout(function () {
          $("#modal").fadeOut(function () {
            $("header").removeClass();

            var els = [
              $("#modal"),
              $form.removeClass("ready"),
              $("h1.nickname")
            ];

            _(els).each(function ($el) {
              $el.removeAttr("style");
            });
          });
        }, 500);
      });
    });

    this.socket.on("errorMessage", function (data) {
      $("p.error").html(data.message);
    });
  };

  $.fn.scrollToBottom = function () {
    $(this).scrollTop($(this).scrollTop() + $(this).height());
  };

  ChatUI.prototype.bindEvents = function () {
    this.displayMessages();
    this.checkTyping();

    var ui = this;

    $("header").on("dblclick", "h1", function () {
      var $header = $(event.currentTarget);
      $header.addClass("edit");
      $header.find("input").focus().select();
    });

    $("form.change-nickname").on("submit", function () {
      event.preventDefault();
      ui._handleNickname();
    });

    $("div#modal").on("click", this._handleNickname.bind(this));

    $(".all-chats").on("keydown", "form", function (e) {
      if (e.which === 13) {
        e.preventDefault();
        var id = $(this).closest("li.chat").attr("data-id");
        ui._handleMessage($(e.target), { id: id });
      }
    });

    $(".all-chats").on("click", "li.chat", function () {
      if (!$(this).hasClass("active")) {
        var index = $(".all-chats").children().index($(this));
        ui.$chatCarousel.scrollTo(index);
      }
    });

    // PRIVATE CHATS
    $(".chatters").on("click", "li", function (e) {
      var isSelf = $(this).hasClass("self");
      var chatIsActive = $(this).closest("li.chat").hasClass("active");

      if (!isSelf && chatIsActive) {
        e.stopPropagation();

        var id = $(this).attr("data-id");
        var chatter = $(e.target).text();
        var index = ui.privateChats.indexOf(id);

        if (index === -1) {
          ui.newPrivateChat(id, chatter);
        } else {
          ui.$chatCarousel.scrollTo(index + 1);
        }
      }
    });

    $(".all-chats").on("click", ".x", function () {
      event.stopPropagation();

      var $chat = $(this).closest("li.chat");
      $chat.remove();

      var index = ui.privateChats.indexOf($chat.attr("data-id"));
      ui.privateChats.splice(index, 1);

      ui.$chatCarousel.updateItems();
      ui.$chatCarousel.slideRight(event);
    });
  };

  ChatUI.prototype._handleNickname = function () {
    $("p.error").empty();
    var newNickname = $("header").find("input").val();

    if (newNickname && this.nickname !== newNickname) {
      this.chat.changeNickname(newNickname);
    } else {
      $("header").removeClass("edit");
    }
  };

  ChatUI.prototype.newPrivateChat = function (id, chatter) {
    $(".all-chats").css({ width: "+=500px" });
    this.privateChats.push(id);

    var template = _.template($("#private-chat").html());
    var content = template({ id: id, nickname: chatter });

    $(".all-chats").append(content);
    this.$chatCarousel.updateItems();
    this.$chatCarousel.scrollTo($(".all-chats").children().length - 1);
  };

  ChatUI.prototype.displayMessages = function () {
    var ui = this;

    this.socket.on("newGuest", function (data) {
      $(".chat-box").append("<p class='notif'>" + data.nickname + " has joined the room</p>");
      $(".chatters").append("<li class='nickname' data-id='" + data.id + "'>" + data.nickname + "</li>");
      $(".chat-box").scrollToBottom();
    });

    this.socket.on("sendMessage", function (data) {
      ui._isTyping = false;
      ui.appendMessage($(".chat-box"), data);
    });

    this.socket.on("sendPrivateMessage", function (data) {
      if (!data.self && ui.privateChats.indexOf(data.chatId) === -1) {
        ui.newPrivateChat(data.chatId, data.senderNickname);
      }

      var $convoBox = $("li.chat[data-id='" + data.chatId + "']").find(".convo");
      $convoBox.find(".typing").remove();
      ui.appendMessage($convoBox, data);
    });

    this.socket.on("nicknameAdded", function (data) {
      $("header").removeClass("edit");
      $("h1.nickname").html(data.nickname);
      $("header input[type=text]").val(data.nickname);
      ui.nickname = data.nickname;
    });

    this.socket.on("displayNicks", function (data) {
      ui.displayNicknames(data.nicknames);

      var $nickname = $(".nickname[data-id='" + data.changedId + "']");
      var nickname = data.nicknames[data.changedId];

      $nickname.html(nickname);
    });

    this.socket.on("guestLeft", function (data) {
      $(".chat-box").append("<p class='notif'>" + data.nickname + " has left the room</p>");

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
  };

  ChatUI.prototype._handleMessage = function ($textarea, private) {
    var message = $textarea.val();

    if (message) {
      var messageText = this._escape(message);
      this.chat.sendMessage(messageText, private);
      $textarea.val("");
    }
  };

  ChatUI.prototype._escape = function (message) {
    var msg = message.replace(/</g, "&lt;");
    msg = msg.replace(/>/g, "&gt;");

    return msg;
  };

  ChatUI.prototype.appendMessage = function ($chatbox, data) {
    $chatbox.append("<p><strong class='nickname' data-id='" + data.senderId + "'>" + data.senderNickname + "</strong>: " + data.text + "</p>");
    $chatbox.scrollToBottom();
  };

  ChatUI.prototype.checkTyping = function () {
    var ui = this;
    var interval;
    this.lastKeypress = Date.now();

    $(".all-chats").on("keypress", "form.private", function () {
      var twoSecondsAgo = Date.now() - 2000;
      var id = $(this).closest("li").data("id");

      if (ui.lastKeypress < twoSecondsAgo) {
        ui.lastKeypress = Date.now();

        if (!interval) {
          ui.socket.emit("typing", { receiverId: id });

          interval = setInterval(function () {
            var twoSecondsAgo = Date.now() - 2000;

            if (ui.lastKeypress < twoSecondsAgo) {
              ui.socket.emit("stopTyping", { receiverId: id });
              clearInterval(interval);
              interval = null;
            }
          }, 2000);
        }
      }
    });

    this.socket.on("isTyping", function (data) {
      var $chat = ui.$privateChat(data.id).find(".convo");

      if ($chat.length > 0) {
        $chat.append("<p class='typing notif'>" + data.nickname + " is typing</p>");
        $chat.scrollToBottom();
      }
    });

    this.socket.on("stoppedTyping", function (data) {
      var $chat = ui.$privateChat(data.id);
      if ($chat.length > 0) $chat.find(".typing").remove();
    });
  };

  ChatUI.prototype.$privateChat = function (id) {
    return $(".all-chats > li[data-id=" + id + "]");
  };

  ChatUI.prototype.displayNicknames = function (nicknames) {
    var $container = $(".chatters");
    $container.empty();

    for (var id in nicknames) {
      var nickname = nicknames[id];
      $container.append("<li class='nickname' data-id='" + id + "'>" + nickname + "</li>");

      if (nickname === this.nickname) {
        $container.children().last().addClass("self");
      }
    }
  };
})(this);