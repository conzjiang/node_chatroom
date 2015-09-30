HelloWorldChat.Views.AllChats = Backbone.View.extend({
  initialize: function () {
    this.mainChatView = new HelloWorldChat.Views.MainChat({
      el: this.$el.find("li.main-chat")
    });

    this.privateChatViews = [];
    this.listenTo(HelloWorldChat.socket, "newChat", this.createNewChat);
    this.listenTo(HelloWorldChat.socket, "remove", this.removeChat);
    this.listenTo(HelloWorldChat.socket, "guestLeft", this.removeGuest);
  },

  events: {
    "click li.nickname": "newPrivateChat",
    "click li.chat": "switchChat"
  },

  createNewChat: function (id, nickname) {
    this.$el.css({ width: "+=500px" });

    var view = new HelloWorldChat.Views.PrivateChat({
      chatId: id,
      nickname: nickname
    });

    this.$el.append(view.render().$el);
    this.privateChatViews.push(view);

    HelloWorldChat.$chatCarousel.updateItems();
    HelloWorldChat.$chatCarousel.scrollTo(this.$el.children().length - 1);
  },

  removeChat: function (id, active) {
    var chatIndex = this.indexOf(id);
    var chatView = this.privateChatViews[chatIndex];

    chatView.remove();
    this.privateChatViews.splice(chatIndex, 1);

    HelloWorldChat.$chatCarousel.updateItems();
    if (active) HelloWorldChat.$chatCarousel.slideRight(chatIndex);
  },

  removeGuest: function (data) {
    var privateIndex = this.indexOf(data.id);

    this.mainChatView.appendToChat("<p class='notif'>" + data.nickname + " has left the room</p>");

    if (privateIndex !== -1) {
      var view = this;
      var $privateChat = this.$el.children().eq(privateIndex + 1);
      var removeChat = function () {
        var active = false;
        if (HelloWorldChat.$chatCarousel.activeIdx === privateIndex + 1) active = true;
        view.removeChat(data.id, active);
      };

      $privateChat.html("<p class='guest-left'>" + data.nickname + " has left the building</p>");
      setTimeout(removeChat, 1500);
    }

    $(".chatters > li").findByDataId(data.id).remove();
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
        HelloWorldChat.$chatCarousel.scrollTo(index + 1);
      }
    }
  },

  switchChat: function (e) {
    var $chat = $(e.currentTarget);

    if (!$chat.hasClass("active")) {
      var chatIndex = this.$el.children().index($chat);
      HelloWorldChat.$chatCarousel.scrollTo(chatIndex);
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