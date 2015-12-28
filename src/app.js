/*globals*/
require('gsap');


/*deps*/
var react_redux = require('react-redux');
var Provider = react_redux.Provider;
var render = require('react-dom').render;
var React = require('react');
var connect = react_redux.connect;

var store = require('./store');

/*containers*/
// var Widget = require('./parts/Widget');
var PieceView = require('./parts/PieceView');
var Gui = require('./parts/Gui');





var App = React.createClass({
	componentDidMount: function(){
		
	},
	render: function(){
		console.log("APP PROPS",this.props);
		return (
			<div id='root'>
				<PieceView/>
				<Gui/>
			</div>
		)
	}
})


function select(state){
	console.log("STATE IS",state)
	return {
		pieces: {
			all: state.pieces,
			recent: [],
			most_viewed: [],
			most_liked: [],
			picked: [],
		}
	}
}

var BoundApp = connect(select)(App);


render(
  <Provider store={store}>
    <BoundApp />
  </Provider>,
  document.getElementById('webpiece')
)