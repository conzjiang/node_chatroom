module.exports = {
  nicknameLength: function (min, max) {
    return "Nickname must be between " + min + "-" + max + " characters.";
  },

  nicknameTaken: function (nickname) {
    return "'" + nickname +
      "' is already taken. Please pick another nickname.";
  }
};
