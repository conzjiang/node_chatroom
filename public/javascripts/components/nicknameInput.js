(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});
  var socket = PnB.socket;
  var Greeting = PnB.Greeting;

  PnB.NicknameInput = React.createClass({displayName: "NicknameInput",
    getInitialState: function () {
      return {
        nickname: "",
        error: "",
        fadeOut: false
      };
    },

    componentDidMount: function () {
      socket.on('connected', this.setTempNickname);
      socket.on('errorMessage', this.showError);
      socket.on('chatReady', this.enterRoom);
    },

    render: function () {
      return (
        React.createElement("header", {className: "edit connected"}, 
          React.createElement("h1", {className: "nickname"}, this.state.nickname), 

          React.createElement("form", {className: "change-nickname"}, 
            React.createElement(Greeting, {hide: this.state.fadeOut}, "You can call me"), 
            React.createElement("input", {
              type: "text", 
              ref: "input", 
              value: this.state.nickname, 
              onChange: this.handleChange, 
              onBlur: this.saveNickname}), 

            React.createElement("strong", {className: "error"}, this.state.error)
          ), 

          React.createElement("div", {id: "header-modal", className: "modal"})
        )
      );
    },

    handleChange: function (e) {
      this.setState({
        nickname: e.currentTarget.value.trim()
      });
    },

    setTempNickname: function (data) {
      var input = this.refs.input.getDOMNode();

      this.setState({
        nickname: data.tempNick
      });
      socket.id = data.id;

      input.focus();
      input.select();
    },

    showError: function (error) {
      this.setState({
        error: error.message
      });
    },

    enterRoom: function () {
      this.refs.input.getDOMNode().blur();

      this.setState({
        error: "",
        fadeOut: true
      });
    },

    saveNickname: function (e) {
      e.preventDefault();
      this.setState({
        error: ""
      });

      if (this.state.nickname && socket.nickname !== this.state.nickname) {
        socket.changeNickname(this.state.nickname);
      }
    }
  });
})(this);
