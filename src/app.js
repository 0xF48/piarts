/*globals*/
require('gsap/src/uncompressed/TweenMax.js');
require('gsap/src/uncompressed/easing/EasePack.js');


/*deps*/
var react_redux = require('react-redux');
var Provider = react_redux.Provider;
var render = require('react-dom').render;
var React = require('react');
var connect = react_redux.connect;

var s = require('./store');

/*containers*/
// var Widget = require('./parts/Widget');
var PieceView = require('./parts/PieceView');
var Gui = require('./parts/Gui');





var App = React.createClass({
	componentDidMount: function(){
		window.app = this;
	},
	// childContextTypes: {
	// 	state: React.PropTypes.object,
	// },
	// getChildContext: function() {
	// 	return {
	// 		state: s.store.getState()
	// 	}
	// },
	render: function(){
		return (
			<div id='root'>
				<PieceView/>
				<Gui items={this.props.pieces}/>
			</div>
		)
	}
})



function select(state){
	return {
		pieces: {
			saving_piece: state.saving_piece,
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
  <Provider store={s.store}>
    <BoundApp />
  </Provider>,
  document.getElementById('webpiece')
)