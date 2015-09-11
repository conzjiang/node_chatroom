window.NodeFun = {
  Models: {},
  Views: {},
  initialize: function (options) {
    NodeFun.$chatCarousel = $(".all-chats").carousel();
    new NodeFun.ChatUI();
  }
};

