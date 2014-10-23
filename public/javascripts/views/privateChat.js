NodeFun.Views.PrivateChat = Backbone.View.extend({
  initialize: function (options) {
    this.chatId = options.chatId;
    this.nickname = options.nickname;

    this.$el.data("id", this.id);
  },

  tagName: "li",

  className: "chat",

  render: function () {
    var template = _.template($("#private-chat").html());
    var content = template({ id: this.chatId, nickname: this.nickname });
    this.$el.append(content);
    return this;
  }
});