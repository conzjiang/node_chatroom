(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.socket = NodeFun.socket.socket;
    this.$chatCarousel = NodeFun.$chatCarousel;

    this.nicknames = {};
    this.privateChats = [];

    this.initializeViews();
    this.bindEvents();
  };

  ChatUI.prototype.initializeViews = function () {
    this.topBarView = new NodeFun.Views.TopBar({ el: $("header") });
    this.allChatsView = new NodeFun.Views.AllChats({ el: $("ul.all-chats") });
    this.mainChatView = new NodeFun.Views.MainChat({ el: $("li.main-chat") });
  };

  ChatUI.prototype.enterRoom = function () {
    var nickname = NodeFun.socket.nickname;
    $("p.error").empty();

    var $form = $("form.change-nickname").blur();
    var $h2 = $form.find("h2");
    $h2.fadeOut(1000, $.fn.remove.bind($h2));

    $form.animate({ top: "-26px" }, 1000, function () {
      // adjust position after h2 fades out
      $form.css({ top: "20px" }).addClass("ready").off(".connected");
      $("h1.nickname").css({ display: "block" }).html(nickname);

      setTimeout(function () {
        $("#modal").fadeOut(removeInlineStyles);
      }, 500);
    });

    function removeInlineStyles() {
      $("header").removeClass();

      var els = [
        $("#modal"),
        $form.removeClass("ready"),
        $("h1.nickname")
      ];

      _(els).each(function ($el) { $el.removeAttr("style"); });
    };
  };

  ChatUI.prototype.bindEvents = function () {
    var ui = this;

    this.displayMessages();
    this.checkTyping();

    this.socket.on("connected", function (data) {
      var $input = $("header input[type=text]");
      $input.val(data.nickname);
      $input.focus().select();
    });

    this.socket.on("chatReady", this.enterRoom.bind(this));

    this.socket.on("errorMessage", function (data) {
      $("p.error").html(data.message);
    });

    // PRIVATE CHATS
    $(".all-chats").on("click", ".x", function () {
      event.stopPropagation();

      var $chat = $(this).closest("li.chat");
      $chat.removeAndUnbind();

      var index = ui.privateChats.indexOf($chat.attr("data-id"));
      ui.privateChats.splice(index, 1);

      ui.$chatCarousel.updateItems();
      ui.$chatCarousel.slideRight(event);
    });
  };

  ChatUI.prototype.newPrivateChat = function (id, chatter) {
    this.$privateChat(id).on("transitionend", function () {
      $(this).find("textarea").focus();
    });
  };

  ChatUI.prototype.displayMessages = function () {
    var ui = this;

    this.socket.on("newGuest", function (data) {
      var guest = ui.nicknames[data.id] = data.nickname;
      $(".chat-box").append("<p class='notif'>" + guest + " has joined the room</p>");
      $(".chatters").append("<li class='nickname' data-id='" + data.id + "'>" + guest + "</li>");
      $(".chat-box").scrollToBottom();
    });

    this.socket.on("sendMessage", function (data) {
      ui.appendMessage($(".chat-box"), data);
    });

    this.socket.on("sendPrivateMessage", function (data) {
      if (!ui.isSelf(data.senderId) &&
        ui.privateChats.indexOf(data.chatId) === -1) {
        ui.newPrivateChat(data.chatId, ui.nicknames[data.senderId]);
      }

      var $convoBox = ui.$privateChat(data.chatId).find(".convo");
      $convoBox.find(".typing").remove();
      ui.appendMessage($convoBox, data);
    });

    this.socket.on("nicknameAdded", function () {
      NodeFun.socket.trigger("change");
    });

    this.socket.on("displayNicks", function (data) {
      ui.nicknames = data.nicknames;
      ui.displayNicknames();

      var $nickname = $(".nickname[data-id='" + data.changedId + "']");
      var nickname = data.nicknames[data.changedId];

      $nickname.html(nickname);
    });

    this.socket.on("guestLeft", function (data) {
      var nickname = ui.nicknames[data.id];
      var privateIndex = ui.privateChats.indexOf(data.id);

      $(".chat-box").append("<p class='notif'>" + nickname + " has left the room</p>");

      if (privateIndex !== -1) {
        var $privateChat = ui.$privateChat(data.id);
        $privateChat.html("<p class='guest-left'>" + nickname + " has left the building</p>");
        delete ui.nicknames[data.id];

        setTimeout(function () {
          $privateChat.removeAndUnbind();
          ui.privateChats.splice(privateIndex, 1);
          ui.$chatCarousel.updateItems();

          if (ui.$chatCarousel.activeIdx === privateIndex + 1) {
            ui.$chatCarousel.scrollTo(privateIndex);
          }
        }, 1500);
      }

      $(".chatters > li[data-id=" + data.id + "]").removeAndUnbind();
    });
  };

  ChatUI.prototype.appendMessage = function ($chatbox, data) {
    var id = data.senderId, nickname = this.nicknames[id];
    $chatbox.append("<p><strong class='nickname' data-id='" + id + "'>" + nickname + "</strong>: " + data.text + "</p>");
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
      var nickname = ui.nicknames[data.id];

      if ($chat.length > 0) {
        $chat.append("<p class='typing notif'>" + nickname + " is typing</p>");
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

  ChatUI.prototype.displayNicknames = function () {
    var $container = $(".chatters");
    $container.empty();

    for (var id in this.nicknames) {
      var nickname = this.nicknames[id];
      $container.append("<li class='nickname' data-id='" + id + "'>" + nickname + "</li>");

      if (this.isSelf(id)) {
        $container.children().last().addClass("self");
      }
    }
  };

  ChatUI.prototype.isSelf = function (id) {
    return this.nicknames[id] === NodeFun.socket.nickname;
  };
})(window);