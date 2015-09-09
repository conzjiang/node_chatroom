(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});

  PnB.ErrorMessages = {
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
})(this);
