module.exports = {
  nicknameLength: function () {
    return "Nickname must be between " +
      PnB.HandleNickname.MIN_LENGTH + "-" + PnB.HandleNickname.MAX_LENGTH +
      " characters."
  },

  nicknameTaken: function (nickname) {
    return "'" + nickname +
      "' is already taken. Please pick another nickname."
  }
};
