HelloWorldChat.Views.ChatCarousel = HelloWorldChat.View.extend({
  initialize: function () {
    this.$el.carousel();
    this.$el.addKey(null); // main chat is first item in carousel
    this.chats = {};

    this.initializeViews();
    this.listenFor('privateChat', this.getChat);
    this.listenFor('privateMessage', this.newPrivateMessage);
    this.listenFor('guestLeft', this.maybeRemoveChat);
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
    if (this.chats[socket.id]) {
      this.goToChat(socket.id);
    } else {
      this.createNewChat(socket);
    }
  },

  goToChat: function (id) {
    this.scrollTo(id);
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
    this.$el.addKey(socket.id);
    this.chats[socket.id] = chat;

    this.listenTo(chat, 'go', this.goToChat);
    this.listenToOnce(chat, 'end', this.removeChat);
  },

  scrollTo: function (id) {
    this.$el.scrollTo(id);
  },

  newPrivateMessage: function (data) {
    if (this.$el.hasKey(data.chatId)) { return; }

    this.createNewChat({
      id: data.chatId,
      nickname: data.nickname
    });
  },

  removeChat: function (chat) {
    chat.remove();
    delete this.chats[chat.chatId];
    this.$el.removeKey(chat.chatId);

    if (chat.isActive()) {
      this.scrollTo(null);
    }
  },

  maybeRemoveChat: function (socket) {
    var chat;

    if (chat = this.chats[socket.id]) {
      chat.disconnect();
      setTimeout(this.removeChat.bind(this, chat), 2000);
    }
  }
});
