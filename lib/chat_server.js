var NicknameManager = require("./nickname_manager");
var HandleNickname = require("./handle_nickname");
var HandleMessages = require("./handle_messages");
var HandleTyping = require("./handle_typing");

var ChatServer = function (server) {
  this.allSockets = require('socket.io').listen(server);
  this.nicknameManager = new NicknameManager();

  this.startListening();
};

ChatServer.prototype.startListening = function () {
  this.allSockets.on('connection', this.handleSocket.bind(this));
};

ChatServer.prototype.handleSocket = function (socket) {
  socket.emit("connected", {
    id: socket.id,
    tempNick: this.nicknameManager.newGuest()
  });

  this.handleNickname(socket);
  this.handleMessages(socket);
  this.handleTyping(socket);
};

ChatServer.prototype.handleNickname = function (socket) {
  new HandleNickname({
    socket: socket,
    allSockets: this.allSockets,
    nicknameManager: this.nicknameManager
  });
};

ChatServer.prototype.handleMessages = function (socket) {
  new HandleMessages({
    socket: socket,
    allSockets: this.allSockets,
    nicknameManager: this.nicknameManager
  });
};

ChatServer.prototype.handleTyping = function (socket) {
  new HandleTyping({
    socket: socket
  });
};

module.exports = ChatServer;
