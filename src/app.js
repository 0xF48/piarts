
var Browser = require('./parts/browser');
var Provider = require('react-redux').provider;
var render = require('react-dom').render;


var store = require('./store');

// var Widget = require('./parts/Widget');
var PieceView = require('./pars/PieceView');
var Gui = require('./parts/Gui');





var App = React.createClass({

	componentDidMount: function(){
		console.log('MOUNTED',this.props.creatures);
	},
	render: function(){
		return (
			<App>
				<PieceView/>
				<Gui/>
			</App>

		)
	}
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('webpiece')
)


module.exports = connect(function(state){return state})(App);