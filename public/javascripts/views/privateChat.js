NodeFun.Views.PrivateChat = NodeFun.Views.Chat.extend({
  initialize: function (options) {
    this.chatId = options.chatId;
    this.nickname = options.nickname;

    this.$el.data("id", this.chatId);
    this.listenTo(NodeFun.socket, this.chatId, this.appendMessage);

    _.extend(this.events, NodeFun.Views.Chat.prototype.events);
  },

  tagName: "li",

  className: "chat",

  events: {
    "transitionend": "focusTextarea",
    "click .x": "closeChat"
  },

  focusTextarea: function () {
    this.$el.find("textarea").focus();
  },

  closeChat: function (e) {
    e.stopPropagation();
    this.remove();
    NodeFun.socket.trigger("remove", this.chatId);
  },

  render: function () {
    var privateChat = _.template($("#private-chat").html());
    var content = privateChat({ id: this.chatId, nickname: this.nickname });
    this.$el.append(content);

    this.$chat = this.$el.find(".convo");

    return this;
  }
});