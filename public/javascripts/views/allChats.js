NodeFun.Views.AllChats = Backbone.View.extend({
  initialize: function () {
    this.privateChatViews = [];
  },

  events: {
    "keydown form": "sendMessage",
    "click li.nickname": "newPrivateChat",
    "click li.chat": "switchChat"
  },

  sendMessage: function (e) {
    var $textarea = this.$el.find("textarea");

    if (e.which === 13) {
      e.preventDefault();
      var message = $textarea.val().clean();
      var receiverId = $(e.currentTarget).closest("li.chat").data("id");

      if (message) {
        NodeFun.socket.sendMessage(message, receiverId);
        $textarea.val("");
      }
    }
  },

  newPrivateChat: function (e) {
    var $clickedName = $(e.currentTarget);
    var isSelf = $clickedName.hasClass("self");
    var chatIsActive = $clickedName.closest("li.chat").hasClass("active");

    if (!isSelf && chatIsActive) {
      e.stopPropagation(); // otherwise it also hits #switchChat
      var id = $clickedName.data("id");
      var chatter = $clickedName.text();
      var index = this._indexOf(id);

      if (index === -1) {
        this._createNewChat(id, chatter);
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

  remove: function () {
    _(this.privateChatViews).each(function (view) { view.remove(); });
    return Backbone.View.prototype.remove.apply(this);
  },

  _indexOf: function (id) {
    var index = -1;

    _(this.privateChatViews).each(function (view, i) {
      if (view.id === id) {
        index = i;
        return false;
      }
    });

    return index;
  },

  _createNewChat: function (id, nickname) {
    this.$el.css({ width: "+=500px" });

    var view = new NodeFun.Views.PrivateChat({
      chatId: id,
      nickname: nickname
    });

    this.$el.append(view.render().$el);
    this.privateChatViews.push(view);

    NodeFun.$chatCarousel.updateItems();
    NodeFun.$chatCarousel.scrollTo(this.$el.children().length - 1);
  }
});