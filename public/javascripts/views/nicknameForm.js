HelloWorldChat.Views.NicknameForm = Backbone.View.extend({
  initialize: function (options) {
    this.socket = options.socket;
    this.listenTo(this.socket, 'connected', this.fillInTempNick);
  },

  events: {
    "submit form": "submitNickname",
    "click #header-modal": "submitNickname",
    "dblclick h1": "editNickname"
  },

  fillInTempNick: function (tempNick) {
    this.$('input').val(tempNick).focus().select();
  },

  submitNickname: function (event) {
    event.preventDefault();
    var nickname = this.$("input").val().clean();
    this.$("p.error").empty();

    if (nickname && HelloWorldChat.socket.get("nickname") !== nickname) {
      HelloWorldChat.socket.changeNickname(nickname);
    } else if (!this.$el.hasClass("connected")) {
      this.$el.removeClass("edit");
    }
  },

  editNickname: function () {
    this.$el.addClass("edit");
    this.$("input").val(HelloWorldChat.socket.get("nickname"));
    this.$("input").focus().select();
  },

  changeNickname: function () {
    console.log(HelloWorldChat.socket.get("nickname"))
    this.$el.removeClass("edit");
    this.$("h1").html(HelloWorldChat.socket.escape("nickname"));
    this.$("input[type=text]").val(HelloWorldChat.socket.escape("nickname"));
  }
});