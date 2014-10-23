NodeFun.Views.AllChats = Backbone.View.extend({
  initialize: function () {
    this.mainChatView = new NodeFun.Views.MainChat({
      el: this.$el.find("li.main-chat")
    });

    this.privateChatViews = [];
    this.listenTo(NodeFun.socket, "newChat", this.createNewChat);
    this.listenTo(NodeFun.socket, "remove", this.removeChat);
  },

  events: {
    "click li.nickname": "newPrivateChat",
    "click li.chat": "switchChat"
  },

  createNewChat: function (id, nickname) {
    this.$el.css({ width: "+=500px" });

    var view = new NodeFun.Views.PrivateChat({
      chatId: id,
      nickname: nickname
    });

    this.$el.append(view.render().$el);
    this.privateChatViews.push(view);

    NodeFun.$chatCarousel.updateItems();
    NodeFun.$chatCarousel.scrollTo(this.$el.children().length - 1);
  },

  removeChat: function (id) {
    var chatIndex = this.indexOf(id);
    this.privateChatViews.splice(chatIndex, 1);

    NodeFun.$chatCarousel.updateItems();
    NodeFun.$chatCarousel.slideRight(chatIndex);
  },

  newPrivateChat: function (e) {
    var $clickedName = $(e.currentTarget);
    var isSelf = $clickedName.hasClass("self");
    var mainChatIsActive = $clickedName.closest("li.chat").hasClass("active");

    if (!isSelf && mainChatIsActive) {
      e.stopPropagation(); // otherwise it also hits #switchChat
      var id = $clickedName.data("id");
      var chatter = $clickedName.text();
      var index = this.indexOf(id);

      if (index === -1) {
        this.createNewChat(id, chatter);
      } else {
        NodeFun.$chatCarousel.scrollTo(index + 1);
      }
    }
  },

  switchChat: function (e) {
    var $chat = $(e.currentTarget);

    if (!$chat.hasClass("active")) {
      var chatIndex = this.$el.children().index($chat);
      NodeFun.$chatCarousel.scrollTo(chatIndex);
    }
  },

  indexOf: function (id) {
    var index = -1;

    _(this.privateChatViews).each(function (view, i) {
      if (view.chatId === id) {
        index = i;
        return false;
      }
    });

    return index;
  },

  remove: function () {
    this.mainChatView.remove();
    _(this.privateChatViews).each(function (view) { view.remove(); });
    return Backbone.View.prototype.remove.apply(this);
  }
});