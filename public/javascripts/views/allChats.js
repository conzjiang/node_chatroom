NodeFun.Views.AllChats = Backbone.View.extend({
  initialize: function () {
    this.socket = NodeFun.socket;
  },

  events: {
    "keydown form": "sendMessage"
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
  }
});