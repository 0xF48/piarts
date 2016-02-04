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
var Viewer = require('./parts/Viewer');
var Gui = require('./parts/Gui');
var Info = require('./parts/Info');

var App = React.createClass({

	getInitialState: function(){
		return {
			view_beta: 100
		}
	},

	componentDidMount: function(){
		window.app = this;
		window.addEventListener('resize',function(){
			this.forceUpdate();
		}.bind(this))
		this.forceUpdate();
		//setTimeout(function() {s.setPiece('example',[0.1,0.2,0.3,0.3,0.3])}, 1);		
		 //set new piece configuration
	},

	componentDidUpdate: function(){
		// console.log("APP SHOW STORE",this.props.show_store)
		// if(this.props.show_store){
		// 	this.refs["root"].to({
		// 		beta: 0,
		// 		dur: 0.5
		// 	})				
		// }else{
		// 	this.refs["root"].to({
		// 		beta: 100,
		// 		dur: 0.5
		// 	})
		// }
	},

	// toggleSidebar: function(){
	// 	console.log("toggle")
	// 	if(this.state.view_beta == 100){
	// 		this.setState({view_beta:20})
	// 	}else{
	// 		this.setState({view_beta:100})
	// 	}
	// },

	render: function(){
		console.log(this.props.show_info)
		return (
			<I slide index_pos={this.props.show_info ? 1 : 0} vertical beta={100} ref="root" >
				<I slide beta={100} ref="top" >
					<Gui slide width={this.props.show_browser ? 500 : 50} />
					<Viewer beta={100} offset={-50} />
				</I>
				<Info beta = {20}/>
			</I>
		)
	}
})



						

function select(state){
	return {
		show_info: state.app.show_info,
		show_browser: state.app.show_browser,
		saving_piece: state.app.saving_piece,
		params: state.app.piece_params,
		pieces: {
			saving_piece: state.app.saving_piece,
			all: state.app.pieces,
			recent: [],
			most_viewed: [],
			most_liked: [],
			picked: [],
		}
	}
}

var BoundApp = connect(select)(App);



//var Example = require('intui').example;
render(
  <Provider store={s.store}>
    <BoundApp />
  </Provider>,
  document.getElementById('webpiece')
)