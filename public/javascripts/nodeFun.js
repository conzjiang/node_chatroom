window.NodeFun = {
  Models: {},
  Views: {},
  initialize: function (options) {
    NodeFun.socket = new NodeFun.Models.Socket(options);
    NodeFun.$chatCarousel = $(".all-chats").carousel();
    new NodeFun.ChatUI();
  }
};

