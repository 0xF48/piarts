var I = require('intui').Slide;
var React = require('react');
var PiecePreview = require('./PiecePreview');
var connect = require('react-redux').connect;
var SlideMixin = require('intui').Mixin
var C = require('circui').Circle;
var s = require('../store')


/* inverted button */
var InvButton = React.createClass({
	mixins: [SlideMixin],
	getDefaultProps: function(){
		return {
			down: false,
			right: true,
			top: false,
			left: false,
			active: false,
			index_offset: 3,
			c1: '#fff',
			c2: '#000',
		}
	},
	getInitialState: function(){
		return {
			hover: false
		}
	},
	toggleHover: function(){
		this.setState({
			hover: !this.state.hover
		})
	},
	render: function(){
		if(this.props.icon != null){
			var icon = <b className={this.props.icon}></b>
		}else{
			var icon = this.props.children
		}

		var index_pos = this.props.active ? (this.props.left || this.props.up) ? 0 : 1 : (this.props.left || this.props.up) ? 1 : 0
		var index_offset = this.props.active ? 0 : (this.state.hover ? this.props.index_offset : 0)
		if(this.props.left || this.props.up) index_offset *= -1

		var vertical = false
		if(this.props.up || this.props.down) vertical = true

		var c1 = this.props.up || this.props.left ? this.props.c2 : this.props.c1
		var c2 = this.props.up || this.props.left ? this.props.c1 : this.props.c2

		var top_style = {color:c1,background:c2}
		var bot_style = {color:c2,background:c1}

		return (
			<I {...this.props} slide vertical={vertical} slide_duration={this.active ? 1 : 0.5} index_pos={index_pos} index_offset={index_offset} onHover={this.toggleHover}>
				<I beta={100} innerClassName={'gui-button-layer '+ ((this.props.left || this.props.up) ? this.props.botClassName : this.props.topClassName)} style={top_style}>
					{icon}
				</I>
				<I beta={100} innerClassName={'gui-button-layer '+ ((this.props.left || this.props.up) ? this.props.topClassName : this.props.botClassName)} style={bot_style}>
					{icon}
				</I>
			</I>
		)
	}
})



var Sidebar = React.createClass({
	mixins: [SlideMixin],
	getDefaultProps: function(){
		return {
			width: null
		}
	},
	getInitialState: function(){
		return {
			active_button: -1
		}
	},

	toBrowserRecent: function(){
		console.log("TEST")
		if(!this.props.show_browser) s.toggleBrowser()
		this.setState({active_button: 0})
	},
	toBrowserLoved: function(){
		if(!this.props.show_browser) s.toggleBrowser()
		console.log("TEST")
		this.setState({active_button: 1})	
	},
	toBrowserPicked: function(){
		if(!this.props.show_browser) s.toggleBrowser()
		this.setState({active_button: 2})
	},
	showInfo: function(){
		s.toggleInfo()
	},

	shouldComponentUpdate: function(props){
		if(this.props.show_browser != props.show_browser && props.show_browser == false){
			this.setState({active_button:-1})
		}
		return true 
	},

	componentDidMount: function(){
		window.sidebar = this.refs['sidebar']
		window.sidebar_top = this.refs['sidebar_top']
	},

	render: function(){
		return (
			<I {...this.props} id = 'sidebar' ref="sidebar" outerClassName="gui-sidebar" >
				<I vertical beta={100} offset={-50} ref = 'sidebar_top'>
					<InvButton c1 = '#00C85C' c2 ='#003016' left onClick={this.toBrowserRecent} height={this.props.width} icon= 'icon-leaf-1' active = {this.state.active_button == 0} index_offset={3} />
					<InvButton c1 = '#C80041' c2 ='#30000A' up onClick={this.toBrowserLoved} height={this.props.width} icon= 'icon-heart-1' active = {this.state.active_button == 1} index_offset={3} />
					<InvButton c1 = '#C8A700' c2 ='#302900' right onClick={this.toBrowserPicked} height={this.props.width} icon= 'icon-isight' active = {this.state.active_button == 2} index_offset={3} />
				</I>
				<InvButton c1 = '#FFDEBF' c2 ='#2A2828' down onClick={this.showInfo} height={this.props.width} icon= 'icon-info-circled' active = {this.props.show_info} index_offset={3} />
			</I>
		)
	}
})


var Browser = React.createClass({
	mixins: [SlideMixin],
	getInitialState: function(){
		return {
			filter: 'recent'
		}
	},

	loadList: function(filter){
		if(this.props.items[filter] == null) throw "cant load list, bad filter"

		this.setState({
			filter:filter
		})
	},
	render: function(){
		return (
			<I {...this.props} id='browser'>
				<b>browser</b>
			</I>
		)
	}
})

var Gui = React.createClass({
	mixins: [SlideMixin],

	getInitialState: function(){
		return {
			index: 0
		}
	},

	componentDidMount: function(){
		// window.gui = this
		// s.updateList(this.state.filter);

		// //this.checker = setInterval(this.checkForUpdate, 500);
		// window.header_slide = this.refs.header_slide
		// window.list = this.refs.test;
	},



	checkForUpdate: function(){
		// if(this.props.fetching_list) return;
		// if(!this.state.filter) return;

		// var scroll = this.refs.content.scrollTop;
		// var height = this.refs.content.clientHeight;

		// var length = this.props.items[this.state.filter].length;


		// if(scroll > PIECE_HEIGHT*length-height/2){
		// 	console.log("CHECK FOR UPDATE");
		// 	s.checkForUpdate(this.state.filter);
		// }
	},

	// shouldComponentUpdate: function(props,state){
	// 	// if(!this.props.fetching_list && props.fetching_list){
	// 	// 	this.setState(Object.assign(state,{
	// 	// 		loading: true
	// 	// 	}))
	// 	// 	return false
	// 	// }else if(this.props.fetching_list && !props.fetching_list){
	// 	// 	this.setState(Object.assign(state,{
	// 	// 		loading: false
	// 	// 	}))
	// 	// 	return false
	// 	// }

	// 	// return true;
	// },

	componentWillUpdate: function(props,state){

		// if(state.loading && !this.state.loading){
		// 	if(!props.items[state.filter].length){
		// 		console.log("LOADING NEW");
		// 		this.refs.header_slide.slide({
		// 			beta: 50
		// 		})			
		// 	}else{
		// 		console.log("LOADING OLD");
		// 		this.refs.header_slide.slide({
		// 			beta: 5
		// 		})				
		// 	}

		// }else if(!state.loading && this.state.loading){
		// 	console.log("DONE LOADING.");
		// 	this.refs.header_slide.slide({
		// 		beta: 0
		// 	})		
		// }


		// if(!props.fetching_list && !props.items[state.filter].length){
		// 	console.log("LIST EMPTY, FETCH NEW.");
		// 	s.updateList(state.filter);
		// }
	},

	test: function(){
		this.setState({index: this.state.index == 0 ? 1 : 0})
	},


	render: function(){
		return (
			<I {...this.props} index_pos={this.props.show_browser ? 0 : 1}  id="gui" ref="root">
				<Browser width = {450}/>
				<Sidebar slide show_browser ={this.props.show_browser} show_info ={this.props.show_info} vertical width = {50} />
			</I>
		)
	}
})


var select = function(state){
	//console.log("STATE ITEMS",state)
	return {
		show_info: state.app.show_info,
		show_browser: state.app.show_browser,
		fetching_list: state.app.fetching_list,
		items: state.app.piece_items
	}
}


module.exports = connect(select)(Gui)


