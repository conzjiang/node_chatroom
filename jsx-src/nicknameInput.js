(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});
  var socket = PnB.socket;

  var NicknameInput = PnB.NicknameInput = React.createClass({
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
        <header className="edit connected">
          <h1 className="nickname">{this.state.nickname}</h1>

          <form className="change-nickname">
            <h2>You can call me</h2>
            <input
              type="text"
              ref="input"
              value={this.state.nickname}
              onChange={this.handleChange} />

            <strong className="error"></strong>
          </form>

          <div id="header-modal" className="modal"></div>
        </header>
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
