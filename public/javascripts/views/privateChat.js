NodeFun.Views.PrivateChat = NodeFun.Views.Chat.extend({
  initialize: function (options) {
    this.chatId = options.chatId;
    this.nickname = options.nickname;
    this.lastKeypress = Date.now();
    this.typingInterval;

    this.$el.data("id", this.chatId);
    this.listenTo(NodeFun.socket, this.chatId, this.appendMessage);
    this.listenTo(NodeFun.socket, this.chatId + "typing", this.showTyping);
    this.listenTo(NodeFun.socket, this.chatId + "doneTyping", this.stopTyping);

    _.extend(this.events, NodeFun.Views.Chat.prototype.events);
  },

  tagName: "li",

  className: "chat",

  events: {
    "transitionend": "focusTextarea",
    "click .x": "closeChat",
    "keypress form": "type"
  },

  focusTextarea: function () {
    this.$("textarea").focus();
  },

  closeChat: function (e) {
    e.stopPropagation();
    NodeFun.socket.trigger("remove", this.chatId, true);
  },

  type: function () {
    NodeFun.socket.type(this.chatId);
  },

  showTyping: function (data) {
    this.appendToChat("<p class='typing notif'>" + data.nickname + " is typing</p>");
  },

  stopTyping: function () {
    this.$chat.find(".typing").remove();
  },

  render: function () {
    var privateChat = _.template($("#private-chat").html());
    var content = privateChat({ id: this.chatId, nickname: this.nickname });
    this.$el.append(content);
    this.$chat = this.$(".convo");

    return this;
  }
});