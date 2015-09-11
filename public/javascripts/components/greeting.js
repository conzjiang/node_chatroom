(function (root) {
  var PnB = root.PizzaAndBunny = (root.PizzaAndBunny || {});

  PnB.Greeting = React.createClass({displayName: "Greeting",
    getDefaultProps: function () {
      return {
        hide: React.PropTypes.bool
      };
    },

    getInitialState: function () {
      return {
        remove: false
      };
    },

    componentDidMount: function () {
      if (!this.props.hide) {
        return;
      }

      this.refs.header.getDOMNode().on('transitionend', this.remove);
    },

    render: function () {
      if (this.state.remove) {
        return null;
      } else {
        var className = this.props.hide ? "fade-out" : "";

        return (
          React.createElement("h2", {ref: "header", className: className}, this.props.children)
        );
      }
    },

    remove: function () {
      this.setState({
        remove: true
      });
    }
  });
})(this);
