NodeFun.Views.TopBar = Backbone.View.extend({
  initialize: function () {
    this.socket = NodeFun.socket;
    this.listenTo(this.socket, "change", this.changeNickname);
  },

  events: {
    "submit form": "submitNickname",
    "click div#modal": "submitNickname",
    "dblclick h1": "editNickname"
  },

  submitNickname: function () {
    event.preventDefault();
    var nickname = this.$el.find("input").val();

    if (nickname && this.socket.nickname !== nickname) {
      this.socket.changeNickname(nickname.escape());
    } else if (!this.$el.hasClass("connected")) {
      this.$el.removeClass("edit");
    }
  },

  editNickname: function () {
    this.$el.addClass("edit");
    this.$el.find("input").focus().select();
  },

  changeNickname: function () {
    this.$el.find("p.error").empty();
    this.$el.removeClass("edit");
    this.$el.find("h1").html(this.socket.nickname);
    this.$el.find("input[type=text]").val(this.socket.nickname);
  }
});