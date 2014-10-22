NodeFun.Views.AllChats = Backbone.View.extend({
  initialize: function () {
    this.socket = NodeFun.socket;
    this.privateChatViews = [];
  },

  events: {
    "keydown form": "sendMessage",
    "click li.nickname": "newPrivateChat",
    "click li.chat": "switchChat"
  },

  sendMessage: function (e) {
    if (e.which === 13) {
      e.preventDefault();
      var receiverId = $(e.currentTarget).closest("li.chat").data("id");
      this._handleMessage($(e.target), receiverId);
    }
  },

  _handleMessage: function ($textarea, receiverId) {
    var message = $textarea.val();

    if (message) {
      var messageText = message.escape();
      this.socket.sendMessage(messageText, receiverId);
      $textarea.val("");
    }
  },

  newPrivateChat: function (e) {
    var $clickedName = $(e.currentTarget);
    var isSelf = $clickedName.hasClass("self");
    var chatIsActive = $clickedName.closest("li.chat").hasClass("active");

    if (!isSelf && chatIsActive) {
      var id = $clickedName.data("id");
      var chatter = $clickedName.text();

      if (this._indexOf(id) === -1) {
        var view = new NodeFun.Views.PrivateChat({ id: id, nickname: chatter });
        this._appendChat(view);
      } else {
        NodeFun.$chatCarousel.scrollTo(index + 1);
      }
    }
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

  _appendChat: function (view) {
    this.$el.css({ width: "+=500px" });
    this.privateChatViews.push(view);

    var template = _.template($("#private-chat").html());
    var content = template({ id: view.id, nickname: view.nickname });
    this.$el.append(content);

    NodeFun.$chatCarousel.updateItems();
    NodeFun.$chatCarousel.scrollTo(this.$el.children().length - 1);
  },

  switchChat: function (e) {
    if (!$(e.currentTarget).hasClass("active")) {
      var index = this.$el.children().index($(e.currentTarget));
      NodeFun.$chatCarousel.scrollTo(index);
    }
  },

  remove: function () {
    _(this.privateChatViews).each(function (view) { view.remove(); });
    return Backbone.View.prototype.remove.apply(this);
  }
});