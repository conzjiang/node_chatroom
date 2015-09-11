(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});
  var socket = PnB.socket;
  var Greeting = PnB.Greeting;

  PnB.NicknameInput = React.createClass({
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
        <header className="edit connected">
          <h1 className="nickname">{this.state.nickname}</h1>

          <form className="change-nickname">
            <Greeting hide={this.state.fadeOut}>You can call me</Greeting>
            <input
              type="text"
              ref="input"
              value={this.state.nickname}
              onChange={this.handleChange}
              onBlur={this.saveNickname} />

            <strong className="error">{this.state.error}</strong>
          </form>

          <div id="header-modal" className="modal"></div>
        </header>
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
