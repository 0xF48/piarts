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
var Browser = require('./parts/Browser');

window.s = s



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

	toggleSidebar: function(){
		console.log("toggle")
		if(this.state.view_beta == 100){
			this.setState({view_beta:20})
		}else{
			this.setState({view_beta:100})
		}
	},

	render: function(){
		return (
			<I slide beta={100} ref="root" >
				<I width={100} ref='browser' style={{background:"#2C2C2D"}}>
					
					
				</I>
				<I beta={100} offset={-100} ref='viewer' style={{background:"#8E8D91"}}>
					<Viewer />
				</I>
			</I>
		)
	}
})



						

function select(state){
	return {
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