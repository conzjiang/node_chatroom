HelloWorldChat.Views.ChatUI = HelloWorldChat.View.extend({
  initialize: function (options) {
    this.$chatCarousel = options.$chatCarousel;

    this.initializeViews();

    this.listenFor('change:nickname', this.changeNickname);
    this.listenFor('newNickname', this.changeAll);
  },

  events: {
    'click #nickname': 'editNickname',
    'click .help-button': 'openHelp',
  },

  editNickname: function () {
    this.nicknameForm.edit();
  },

  initializeViews: function () {
    this.nicknameForm = new HelloWorldChat.Views.NicknameForm({
      contentTemplate: '#nickname-form-template',
      content: '#nickname-form'
    });

    this.$el.append(this.nicknameForm.$el);

    new HelloWorldChat.Views.Chatters({
      el: '.chatters'
    });

    new HelloWorldChat.Views.MainChat({
      el: '.main-chat'
    });
  },

  changeNickname: function () {
    this.$('#nickname').text(this.socket.get('nickname'));
  },

  changeAll: function (guest) {
    this.$('.' + guest.id).text(guest.nickname);
  },

  openHelp: function () {
    var helpView = new HelloWorldChat.Views.HelpView({
      contentTemplate: '#help-info-template',
      content: '.help-info'
    });

    this.$el.append(helpView.$el);
    helpView.render();
  }
});



// (function (root) {
//   var HelloWorldChat = root.HelloWorldChat = (root.HelloWorldChat || {});
//
//   var ChatUI = HelloWorldChat.ChatUI = function () {
//     this.socket = HelloWorldChat.socket.socket;
//     this.$chatCarousel = HelloWorldChat.$chatCarousel;
//     this.nicknames = {};
//
//     this.initializeViews();
//     this.bindEvents();
//   };
//
//   ChatUI.prototype.initializeViews = function () {
//     this.topBarView = new HelloWorldChat.Views.TopBar({ el: $("header") });
//     this.allChatsView = new HelloWorldChat.Views.AllChats({ el: $("ul.all-chats") });
//     this.mainChatView = this.allChatsView.mainChatView;
//     this.footerView = new HelloWorldChat.Views.Help({ el: $('footer') });
//   };
//
//   ChatUI.prototype.bindEvents = function () {
//     var ui = this;
//
//     this.displayMessages();
//     this.checkTyping();
//

//   };
//
//   ChatUI.prototype.displayMessages = function () {
//     var ui = this;
//
//     this.socket.on("newGuest", function (data) {
//       var guest = ui.nicknames[data.id] = data.nickname;
//       HelloWorldChat.socket.trigger("newGuest", guest);
//     });
//
//     this.socket.on("sendMessage", function (data) {
//       HelloWorldChat.socket.trigger("newMessage", {
//         id: data.senderId,
//         nickname: ui.nicknames[data.senderId],
//         message: data.text
//       });
//     });
//
//     this.socket.on("sendPrivateMessage", function (data) {
//       var isSelf = ui.isSelf(data.senderId);
//       var newChat = ui.allChatsView.indexOf(data.chatId) === -1;
//       var nickname = ui.nicknames[data.senderId];
//
//       if (!isSelf && newChat) {
//         HelloWorldChat.socket.trigger("newChat", data.senderId, nickname);
//       }
//
//       HelloWorldChat.socket.trigger(data.chatId, {
//         id: data.senderId,
//         nickname: nickname,
//         message: data.text
//       });
//     });
//   };
//
//   ChatUI.prototype.checkTyping = function () {
//     var ui = this;
//
//     this.socket.on("isTyping", function (data) {
//       var nickname = ui.nicknames[data.id];
//
//       HelloWorldChat.socket.trigger(data.id + "typing", {
//         nickname: nickname
//       });
//     });
//
//     this.socket.on("stoppedTyping", function (data) {
//       HelloWorldChat.socket.trigger(data.id + "doneTyping");
//     });
//   };
//
//   ChatUI.prototype.$privateChat = function (id) {
//     return $(".all-chats > li[data-id=" + id + "]");
//   };
//
//   ChatUI.prototype.isSelf = function (id) {
//     return HelloWorldChat.socket.id === id;
//   };
// })(window);