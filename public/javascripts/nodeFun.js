window.NodeFun = {
  Models: {},
  Views: {},
  initialize: function (options) {
    NodeFun.socket = new NodeFun.Models.Socket(options);
  }
};

