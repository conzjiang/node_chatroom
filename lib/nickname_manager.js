(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});

  var NicknameManager = PnB.NicknameManager = function () {
    this.guestNum = 1;
    this.nicknames = {};
    this.nicknameMap = {};
  };

  NicknameManager.prototype.newGuest = function () {
    return "guest" + this.guestNum++;
  };

  NicknameManager.prototype.save = function (socket, nickname) {
    this.nicknames[nickname] = true;
    this.nicknameMap[socket.id] = nickname;
  };

  NicknameManager.prototype.delete = function (nickname) {
    this.nicknames[nickname] = false;
  };
})(this);
