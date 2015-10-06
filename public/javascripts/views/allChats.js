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

  events: {
    'click .chat': 'go',
    'click .x': 'closeChat'
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

  maybeRemoveChat: function (socket) {
    var chat;

    if (chat = this.chats[socket.id]) {
      chat.disconnect();
      setTimeout(this.removeChat.bind(this, socket.id), 2000);
    }
  },

  removeChat: function (id) {
    var chat = this.chats[id];

    chat.remove();
    delete this.chats[id];
    this.$el.removeKey(id);

    if (chat.isActive()) {
      this.scrollTo(null);
    }
  },

  go: function (e) {
    if ($(e.currentTarget).hasClass('active')) { return; }
    this.goToChat($(e.currentTarget).data('id') || null);
  },

  closeChat: function (e) {
    var chatId = $(e.currentTarget).closest('.chat').data('id');
    this.removeChat(chatId);
  }
});
