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

HelloWorldChat.View = Backbone.View.extend({
  listenFor: function (event, callback) {
    this.listenTo(this.socket, event, callback);
  },

  listenForOnce: function (event, callback) {
    this.listenToOnce(this.socket, event, callback);
  }
});
