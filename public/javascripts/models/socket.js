NodeFun.Models.Socket = Backbone.Model.extend({
  initialize: function (options) {
    this.socket = options.socket;
  },

  emit: function (event, data) {
    this.socket.emit(event, data);
  },

  changeNickname: function (newNickname) {
    this.nickname = newNickname;
    this.socket.emit("nicknameChange", { nickname: newNickname });
  }
});