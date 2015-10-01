HelloWorldChat.Views.ChatCarousel = HelloWorldChat.View.extend({
  initialize: function () {
    this.$el.carousel();
    this.$el.addKey(null); // main chat is first item in carousel
    this.privateChats = {};

    this.initializeViews();
    this.listenFor('privateChat', this.getChat);
  },

  initializeViews: function () {
    this.mainChatView = new HelloWorldChat.Views.MainChat({
      el: '.main-chat'
    });

    new HelloWorldChat.Views.Chatters({
      el: '.chatters'
    });
  },

  getChat: function (socket) {
    if (this.privateChats[socket.id]) {
      this.goToChat(socket.id);
    } else {
      this.createNewChat(socket);
    }
  },

  goToChat: function (id) {

  },

  createNewChat: function (socket) {
    this.$el.css({ width: '+=' + HWCConstants.PRIVATE_CHAT_WIDTH + 'px' });

    var chat = new HelloWorldChat.Views.PrivateChat({
      chatId: socket.id,
      nickname: socket.nickname
    });

    this.$el.append(chat.$el);
    chat.render();

    this.storeChat(socket, chat);
    this.scrollTo(socket.id);
  },

  storeChat: function (socket, chat) {
    this.privateChats[socket.id] = chat;
    this.$el.addKey(socket.id);
  },

  scrollTo: function (id) {
    this.$el.scrollTo(id);
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