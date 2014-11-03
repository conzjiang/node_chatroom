(function (root) {
  var NodeFun = root.NodeFun = (root.NodeFun || {});

  var ChatUI = NodeFun.ChatUI = function () {
    this.socket = NodeFun.socket.socket;
    this.$chatCarousel = NodeFun.$chatCarousel;
    this.nicknames = {};

    this.initializeViews();
    this.bindEvents();
  };

  ChatUI.prototype.initializeViews = function () {
    this.topBarView = new NodeFun.Views.TopBar({ el: $("header") });
    this.allChatsView = new NodeFun.Views.AllChats({ el: $("ul.all-chats") });
    this.mainChatView = this.allChatsView.mainChatView;
  };

  ChatUI.prototype.bindEvents = function () {
    var ui = this;

    this.displayMessages();
    this.checkTyping();

    this.socket.on("connected", function (data) {
      var $input = $("header input[type=text]");
      $input.val(data.nickname);
      $input.focus().select();

      NodeFun.socket.id = data.id;
    });

    this.socket.on("chatReady", this.enterRoom.bind(this));

    this.socket.on("errorMessage", function (data) {
      $("p.error").html(data.message);
    });
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

  ChatUI.prototype.displayMessages = function () {
    var ui = this;

    this.socket.on("newGuest", function (data) {
      var guest = ui.nicknames[data.id] = data.nickname;
      NodeFun.socket.trigger("newGuest", guest);
    });

    this.socket.on("sendMessage", function (data) {
      NodeFun.socket.trigger("newMessage", {
        id: data.senderId,
        nickname: ui.nicknames[data.senderId],
        message: data.text
      });
    });

    this.socket.on("sendPrivateMessage", function (data) {
      var isSelf = ui.isSelf(data.senderId);
      var newChat = ui.allChatsView.indexOf(data.chatId) === -1;
      var nickname = ui.nicknames[data.senderId];

      if (!isSelf && newChat) {
        NodeFun.socket.trigger("newChat", data.senderId, nickname);
      }

      NodeFun.socket.trigger(data.chatId, {
        id: data.senderId,
        nickname: nickname,
        message: data.text
      });
    });

    this.socket.on("nicknameAdded", function () {
      NodeFun.socket.trigger("change");
    });

    this.socket.on("displayNicks", function (data) {
      var $nickname = $(".nickname").findByDataId(data.changedId);
      $nickname.html(NodeFun.socket.nickname);

      ui.nicknames = data.nicknames;
      NodeFun.socket.trigger("newNickname", ui.nicknames);
    });

    this.socket.on("guestLeft", function (data) {
      var nickname = ui.nicknames[data.id];
      NodeFun.socket.trigger("guestLeft", { id: data.id, nickname: nickname });
      delete ui.nicknames[data.id];
    });
  };

  ChatUI.prototype.checkTyping = function () {
    var ui = this;

    this.socket.on("isTyping", function (data) {
      var nickname = ui.nicknames[data.id];

      NodeFun.socket.trigger(data.id + "typing", {
        nickname: nickname
      });
    });

    this.socket.on("stoppedTyping", function (data) {
      NodeFun.socket.trigger(data.id + "doneTyping");
    });
  };

  ChatUI.prototype.$privateChat = function (id) {
    return $(".all-chats > li[data-id=" + id + "]");
  };

  ChatUI.prototype.isSelf = function (id) {
    return NodeFun.socket.id === id;
  };
})(window);