/*globals*/
require('gsap/src/uncompressed/TweenMax.js');
require('gsap/src/uncompressed/easing/EasePack.js');


/*deps*/
var react_redux = require('react-redux');
var Provider = react_redux.Provider;
var render = require('react-dom').render;
var React = require('react');
var connect = react_redux.connect;
var I = require('intui').Slide;

var s = require('./store');

/*containers*/
// var Widget = require('./parts/Widget');
var PieceView = require('./parts/PieceView');
var Gui = require('./parts/Gui');





var App = React.createClass({
	componentDidMount: function(){
		window.app = this;
	},

	componentWillUpdate: function(){
		console.log("APP SHOW STORE",this.props.show_store)
		if(this.props.show_store){
			this.refs.left.to({
				beta: 100
			})
		}else{
			this.refs.left.to({
				beta: 0
			})
		}
	},

	render: function(){
		return (
			<div id='root'>
				<I slide ref='left'>
					<I beta={100} ref='view' style={{background:'#000'}}>
						<PieceView/>
					</I>
					<I beta={100} ref='store' style={{background:'#fff'}}>
					</I>
				</I>
				<Gui items={this.props.pieces}/>
			</div>
		)
	}
})



function select(state){
	return {
		show_store: state.show_store,
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