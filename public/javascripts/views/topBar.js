NodeFun.Views.TopBar = Backbone.View.extend({
  initialize: function () {
    this.socket = NodeFun.socket;
  },

  events: {
    "submit.connected form": "submitNickname",
    "click.connected div#modal": "submitNickname"
  },

  // EVENTS ON CONNECTION
  submitNickname: function () {
    event.preventDefault();
    var nickname = this.$el.find("input").val();

    if (nickname) {
      this.socket.nickname = nickname;

      this.socket.emit("nicknameChange", {
        nickname: nickname,
        newGuest: true
      });
    }
  },

  enterRoom: function () {
    var $view = this.$el;
    var nickname = this.socket.nickname;
    this.$el.find("p.error").empty();

    var $form = this.$el.find("form.change-nickname").blur();
    var $h2 = $form.find("h2");
    $h2.fadeOut(1000, $.fn.remove.bind($h2));

    $form.animate({ top: "-26px" }, 1000, function () {
      // adjust position after h2 fades out
      $form.css({ top: "20px" }).addClass("ready").off(".connected");
      $view.find("h1.nickname").css({ display: "block" }).html(nickname);

      setTimeout(function () {
        $view.find("#modal").fadeOut(removeInlineStyles);
      }, 500);
    });

    function removeInlineStyles() {
      $view.removeClass();

      var els = [
        $view.find("#modal"),
        $form.removeClass("ready"),
        $view.find("h1.nickname")
      ];

      _(els).each(function ($el) { $el.removeAttr("style"); });
    };
  }
});