(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});
  var socket = PnB.socket;

  var NicknameInput = PnB.NicknameInput = React.createClass({displayName: "NicknameInput",
    getInitialState: function () {
      return {
        nickname: ""
      };
    },

    componentDidMount: function () {
      socket.on('connected', this.setTempNickname);
    },

    render: function () {
      return (
        React.createElement("header", {className: "edit connected"}, 
          React.createElement("h1", {className: "nickname"}, this.state.nickname), 

          React.createElement("form", {className: "change-nickname"}, 
            React.createElement("h2", null, "You can call me"), 
            React.createElement("input", {
              type: "text", 
              ref: "input", 
              value: this.state.nickname, 
              onChange: this.handleChange}), 

            React.createElement("strong", {className: "error"})
          ), 

          React.createElement("div", {id: "header-modal", className: "modal"})
        )
      );
    },

    handleChange: function (e) {
      this.setState({
        nickname: e.currentTarget.value
      });
    },

    setTempNickname: function (data) {
      var input = this.refs.input.getDOMNode();

      this.setState({ nickname: data.tempNick });
      socket.id = data.id;

      input.focus();
      input.select();
    }
  });
})(this);
