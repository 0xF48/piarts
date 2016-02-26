var intui = require('intui');
var react_redux = require('react-redux');
var connect = react_redux.connect;
var I = require('intui').Slide;
var SlideMixin = require('intui').Mixin;
var G = require('intui').Grid;
var GItem = require('intui').GridItem;
var GMixin = require('intui').GridMixin;
var Pager = require('intui').Pager;
var s = require('../data/store')
var Button = require('intui').Button;


var PieceItem = React.createClass({
	mixins: [GMixin],
	getInitialState: function(){
		return {
			// c_offset: 170
			// ,toggle_modal: false
		}
	},
	toggleHover: function(){
		// this.setState({
		// 	c_offset: this.state.c_offset == 170 ? 160 : 170,
		// 	toggle_modal: this.props.item.locked ? true : this.state.toggle_modal
		// })
	},
	load: function(){

		s.loadType(s.store.getState().type_items[this.props.item.type_id],function(item){
			s.setCurrentType(item)
			s.setView()
			s.setParams(this.props.item.params)
			s.showView()
		}.bind(this));
	},
	render: function(){

		var item = this.props.item;
		var style = {
			background:  this.props.color
		}

		var params = []
		for(var i in item.params){
			params.push(<div key = {i} className='piece-item-param'>{Math.round(item.params[i]*100)/100}</div>)
		}
		// console.log(item)
		return (
			<GItem {...this.props} onClick = {this.load}  >
				<div className = 'piece-item' style={style}>
					<p>{item.type_name}</p>
					<div className = 'piece-item-params'>{params}</div>
					<div className = 'piece-item-date'>{ (item.created_at ? item.created_at.toDateString() : null)  + ' | '+item.id}</div>
				</div>
			</GItem>
		)
	}
})































var Browser = React.createClass({
	mixins: [SlideMixin],

	colors: {
		'recent':  'rgb(0, 200, 92)',
		'liked' : 'rgb(200, 0, 65)',
		'picked' : 'rgb(230, 178, 0)',
		'saved' : 'rgb(153, 212, 219)'
	},

	getDefaultProps: function(){
		return {
			browser_tab: 'none'
		}
	},
	
	getPos: function(){
		switch(this.props.browser_tab){
			case 'recent':
				return 0
			case 'liked':
				return 1
			case 'picked':
				return 2
			case 'saved':
				return 3
		}
	},

	items: [],

	getInitialState: function(){
		return {
			list_offset: 0,
			page_index: 0,
			items_per_page: 10,
		}
	},

	makeList: function(props,state,items){
		console.log("MAKE LIST",items.length,items)
		this.items = [];
		for(var i = 0;i<items.length;i++){
			var color = this.colors[props.browser_tab]
			if(items[i].picked){
				color = this.colors['picked']
			}else if(items[i].local){
				color = this.colors['saved']
			}
			this.items.push(<PieceItem index = {i} ease_dur={0.5} delay={0.1}  w={Math.floor(1+Math.random()*2)} h={Math.floor(1+Math.random()*2)} color = {color} item = {items[i]} key = {props.browser_tab+'_piece_item_'+items[i].id+(items[i].local ? '_local' : '_')} />)
		}
	},


	shouldComponentUpdate: function(props,state){
		if( ! props.piece_items[props.browser_tab] ) return true
		
		// console.log(props.piece_items[props.browser_tab])

		if(this.props.browser_tab != props.browser_tab || this.items.length != props.piece_items[props.browser_tab].length){
			this.makeList(props,state,props.piece_items[props.browser_tab])
			state.list_offset = 0;			
		}
		
		return true
	},


	previousPage: function(){
		this.setState({
			list_offset: this.state.list_offset - 1,
		})
	},

	nextPage: function(){
		this.setState({
			list_offset: this.state.list_offset + 1,
		})
	},

	componentDidMount: function(){
		window.browser = this
	},

	render: function(){
		
		return (
			<I beta = {this.props.beta} vertical outerClassName = 'piece_list_wrapper' scroll vertical ref="wrapper">
			
				<G ref = "grid" offset = {this.state.list_offset} fill_up={true} fixed={true} w = {3} h={6} list_id = {this.props.browser_tab} className='piece_list' style = {{height: 'calc(100% - 50px)'}} >
					{this.items}
				</G>
				<div className = 'list_refresh_button'>
					<div onClick={this.nextPage}>refresh button</div>
				</div>
			</I>
		)
	}
})




module.exports = Browser
