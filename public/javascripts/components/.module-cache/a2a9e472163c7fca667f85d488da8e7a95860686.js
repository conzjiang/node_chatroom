(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});
  var socket = PnB.socket;

  var NicknameInput = PnB.NicknameInput = React.createClass({displayName: "NicknameInput",
    componentDidMount: function () {
      socket.on('connected', this.setTempNickname.bind(this));
    },

    render: function () {
      return (
        React.createElement("header", null, 
          React.createElement("h1", {class: "nickname"}, this.state.nickname), 

          React.createElement("form", {class: "change-nickname"}, 
            React.createElement("h2", null, "You can call me"), 
            React.createElement("input", {
              type: "text", 
              ref: "input", 
              value: this.state.nickname, 
              onChange: this.handleChange}), 

            React.createElement("strong", {class: "error"})
          ), 

          React.createElement("div", {id: "header-modal", class: "modal"})
        )
      );
    },

    handleChange: function (e) {
      this.setState({
        nickname: e.currentTarget.value
      });
    },

    setTempNickname: function (data) {
      this.setState({ nickname: data.tempNick });
      socket.id = data.id;
      this.refs.input.focus().select();
    }
  });
})(this);
