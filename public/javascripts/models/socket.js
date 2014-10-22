NodeFun.Models.Socket = Backbone.Model.extend({
  initialize: function (options) {
    this.socket = options.socket;
    this.nickname;
  },

  emit: function (event, data) {
    this.socket.emit(event, data);
  }
});