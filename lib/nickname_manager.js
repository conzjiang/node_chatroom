var NicknameManager = function () {
  this.guestNum = 1;
  this.nicknames = {};
  this.nicknameMap = {};
};

NicknameManager.prototype.newGuest = function () {
  return "guest" + this.guestNum++;
};

NicknameManager.prototype.has = function (nickname) {
  return this.nicknames[nickname];
};

NicknameManager.prototype.save = function (socket, nickname) {
  this.nicknames[nickname] = true;
  this.nicknameMap[socket.id] = nickname;
};

NicknameManager.prototype.remove = function (nickname) {
  this.nicknames[nickname] = false;
};

NicknameManager.prototype.delete = function (socket, nickname) {
  this.remove(nickname);
  delete this.nicknameMap[socket.id];
};

module.exports = NicknameManager;
