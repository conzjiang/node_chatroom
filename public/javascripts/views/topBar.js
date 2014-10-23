NodeFun.Views.TopBar = Backbone.View.extend({
  initialize: function () {
    this.listenTo(NodeFun.socket, "change", this.changeNickname);
  },

  events: {
    "submit form": "submitNickname",
    "click div#modal": "submitNickname",
    "dblclick h1": "editNickname"
  },

  submitNickname: function () {
    event.preventDefault();
    var nickname = this.$el.find("input").val().clean();

    if (nickname && NodeFun.socket.nickname !== nickname) {
      NodeFun.socket.changeNickname(nickname);
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
    this.$el.find("h1").html(NodeFun.socket.nickname);
    this.$el.find("input[type=text]").val(NodeFun.socket.nickname);
  }
});