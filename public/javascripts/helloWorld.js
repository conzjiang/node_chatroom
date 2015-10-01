window.HelloWorldChat = {
  Models: {},
  Views: {},
  initialize: function (options) {
    var socket = new HelloWorldChat.Models.Socket({
      socket: options.socket
    });

    HelloWorldChat.View.assignSocket(socket);

    new HelloWorldChat.Views.ChatUI({
      el: options.rootEl
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

HelloWorldChat.View.assignSocket = function (socket) {
  this.prototype.socket = socket;
};
