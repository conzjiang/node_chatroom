(function (root) {
  var HelloWorldChat = root.HelloWorldChat = (root.HelloWorldChat || {});

  var ChatUI = HelloWorldChat.ChatUI = function () {
    this.socket = HelloWorldChat.socket.socket;
    this.$chatCarousel = HelloWorldChat.$chatCarousel;
    this.nicknames = {};

    this.initializeViews();
    this.bindEvents();
  };

  ChatUI.prototype.initializeViews = function () {
    this.topBarView = new HelloWorldChat.Views.TopBar({ el: $("header") });
    this.allChatsView = new HelloWorldChat.Views.AllChats({ el: $("ul.all-chats") });
    this.mainChatView = this.allChatsView.mainChatView;
    this.footerView = new HelloWorldChat.Views.Help({ el: $('footer') });
  };

  ChatUI.prototype.bindEvents = function () {
    var ui = this;

    this.displayMessages();
    this.checkTyping();

    this.socket.on("connected", function (data) {
      var $input = $("header input[type=text]");
      $input.val(data.tempNick);
      $input.focus().select();

      HelloWorldChat.socket.id = data.id;
    });

    this.socket.on("chatReady", this.enterRoom.bind(this));

    this.socket.on("errorMessage", function (data) {
      $("p.error").html(data.message);
    });
  };

  ChatUI.prototype.enterRoom = function () {
    var $form = $("form.change-nickname").blur();
    var nickname = $form.find("input").val().clean();
    var $h2 = $form.find("h2");
    var $modal = $('#header-modal');
    var $nicknameHeader = $('h1.nickname');

    $("p.error").empty();
    $h2.fadeOut(1000, $.fn.remove.bind($h2));
    $form.animate({ top: "-26px" }, 1000, function () {
      // adjust position after h2 fades out
      $form.css({ top: "20px" }).addClass("ready");
      $nicknameHeader.css({ display: "block" }).html(nickname);

      setTimeout(function () {
        $modal.fadeOut(removeInlineStyles);
      }, 500);
    });

    function removeInlineStyles() {
      HelloWorldChat.socket.set("nickname", nickname);
      $("header").removeClass();

      var els = [
        $modal,
        $form.removeClass("ready"),
        $nicknameHeader
      ];

      _(els).each(function ($el) { $el.removeAttr("style"); });
    };
  };

  ChatUI.prototype.displayMessages = function () {
    var ui = this;

    this.socket.on("newGuest", function (data) {
      var guest = ui.nicknames[data.id] = data.nickname;
      HelloWorldChat.socket.trigger("newGuest", guest);
    });

    this.socket.on("sendMessage", function (data) {
      HelloWorldChat.socket.trigger("newMessage", {
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
        HelloWorldChat.socket.trigger("newChat", data.senderId, nickname);
      }

      HelloWorldChat.socket.trigger(data.chatId, {
        id: data.senderId,
        nickname: nickname,
        message: data.text
      });
    });

    this.socket.on("nicknameAdded", function (data) {
      HelloWorldChat.socket.set("nickname", data.nickname);
    });

    this.socket.on("displayNicks", function (data) {
      var $nickname = $(".nickname").findByDataId(data.changedId);
      $nickname.html(HelloWorldChat.socket.get("nickname"));

      ui.nicknames = data.nicknames;
      HelloWorldChat.socket.trigger("newNickname", ui.nicknames);
    });

    this.socket.on("guestLeft", function (data) {
      var nickname = ui.nicknames[data.id];
      HelloWorldChat.socket.trigger("guestLeft", { id: data.id, nickname: nickname });
      delete ui.nicknames[data.id];
    });
  };

  ChatUI.prototype.checkTyping = function () {
    var ui = this;

    this.socket.on("isTyping", function (data) {
      var nickname = ui.nicknames[data.id];

      HelloWorldChat.socket.trigger(data.id + "typing", {
        nickname: nickname
      });
    });

    this.socket.on("stoppedTyping", function (data) {
      HelloWorldChat.socket.trigger(data.id + "doneTyping");
    });
  };

  ChatUI.prototype.$privateChat = function (id) {
    return $(".all-chats > li[data-id=" + id + "]");
  };

  ChatUI.prototype.isSelf = function (id) {
    return HelloWorldChat.socket.id === id;
  };
})(window);