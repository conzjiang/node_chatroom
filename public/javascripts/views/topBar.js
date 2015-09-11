NodeFun.Views.TopBar = Backbone.View.extend({
  initialize: function () {
    this.listenTo(NodeFun.socket, "change:nickname", this.changeNickname);
  },

  events: {
    "submit form": "submitNickname",
    "click #header-modal": "submitNickname",
    "dblclick h1": "editNickname"
  },

  submitNickname: function (event) {
    event.preventDefault();
    var nickname = this.$("input").val().clean();
    this.$("p.error").empty();

    if (nickname && NodeFun.socket.get("nickname") !== nickname) {
      NodeFun.socket.changeNickname(nickname);
    } else if (!this.$el.hasClass("connected")) {
      this.$el.removeClass("edit");
    }
  },

  editNickname: function () {
    this.$el.addClass("edit");
    this.$("input").val(NodeFun.socket.get("nickname"));
    this.$("input").focus().select();
  },

  changeNickname: function () {
    this.$el.removeClass("edit");
    this.$("h1").html(NodeFun.socket.escape("nickname"));
    this.$("input[type=text]").val(NodeFun.socket.escape("nickname"));
  }
});