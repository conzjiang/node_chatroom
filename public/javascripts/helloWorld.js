window.HelloWorldChat = {
  Models: {},
  Views: {},
  initialize: function (options) {
    var socket = new HelloWorldChat.Models.Socket({
      socket: options.socket
    });

    new HelloWorldChat.Views.ChatUI({
      el: options.rootEl,
      socket: socket,
      $chatCarousel: $(".all-chats").carousel()
    });
  }
};

