window.HelloWorldChat = {
  Models: {},
  Views: {},
  initialize: function (options) {
    HelloWorldChat.socket = new HelloWorldChat.Models.Socket(options);
    HelloWorldChat.$chatCarousel = $(".all-chats").carousel();
    new HelloWorldChat.ChatUI();
  }
};

