(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});

  var HandleNickname = PnB.HandleNickname = function (options) {
    this.socket = options.socket;
    this.allSockets = options.allSockets;
    this.nicknameManager = options.nicknameManager;
    this.enteredRoom = false;

    this.bindEvents();
  };

  var MIN_LENGTH = HandleNickname.MIN_LENGTH = 2;
  var MAX_LENGTH = HandleNickname.MAX_LENGTH = 10;

  HandleNickname.prototype.bindEvents = function () {
    this.socket.on("nicknameChange", this.handleChange.bind(this));
  };

  HandleNickname.prototype.handleChange = function (data) {
    var oldNickname = this.nickname;
    this.nickname = data.nickname;

    if (this.checkLength() && this.validateUniqueness()) {
      this.nicknameManager.save(this.socket, this.nickname);
      this.sendNickname();
      this.nicknameManager.delete(oldNickname);
    }
  };

  HandleNickname.prototype.checkLength = function () {
    var nicknameLength = this.nickname.length;

    if (nicknameLength > MAX_LENGTH || nicknameLength < MIN_LENGTH) {
      this.socket.emit("errorMessage", {
        message: PnB.ErrorMessages.nicknameLength()
      });

      return false;
    }

    return true;
  };

  HandleNickname.prototype.validateUniqueness = function () {
    if (this.nicknameManager.has(this.nickname)) {
      this.socket.emit("errorMessage", {
        message: PnB.ErrorMessages.nicknameTaken(this.nickname)
      });

      return false;
    }

    return true;
  };

  HandleNickname.prototype.sendNickname = function () {
    if (this.enteredRoom) {
      this.socket.emit("nicknameAdded", { nickname: this.nickname });
    } else {
      this.enteredRoom = true;

      this.socket.emit("chatReady");
      this.socket.broadcast.emit("newGuest", {
        id: this.socket.id,
        nickname: this.nickname
      });
    }

    this.allSockets.emit("displayNicks", {
      nicknames: this.nicknameManager.nicknameMap,
      changedId: this.socket.id
    });
  };
})(this);
