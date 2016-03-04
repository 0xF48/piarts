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

function getC(c){
	return (c < 0 ? 0 : Math.round(c))
}
var PieceItem = React.createClass({
	mixins: [GMixin],
	getInitialState: function(){
		return {
			// c_offset: 170
			toggle_bg: false,
			c_offset: 170
		}
	},
	toggleHover: function(){
		// this.setState({
		// 	c_offset: this.state.c_offset == 170 ? 160 : 170,
		// 	toggle_modal: this.props.item.locked ? true : this.state.toggle_modal
		// })
	},
	load: function(e){

		s.viewPiece(this.props.item);
		
		e.stopPropagation();
	},

	toggleHover: function(){
		console.log("toggle")
		this.setState({
			toggle_bg: !this.state.toggle_bg
		})
		TweenLite.set(this.refs.bg,{
			// rotationZ: !this.state.toggle_bg ? 10 * (Math.random()<0.5 ? -1 : 1):0,
			// ease: Power2.easeOut,
			webkitFilter: 'blur('+(!this.state.toggle_bg ? 5 : 0)+'px)'
			
		})
		
	},

	render: function(){
		// console.log(this.props.item.created_at)

		var item = this.props.item;
		var type = this.props.type;
		// var style = {
		// 	background:  this.props.color
		// }
		var bg = {
			background: 'url('+( (this.props.w == 1 && this.props.h == 1)  ? item.preview.small : item.preview.medium)+') center',
		}
		var type_style = {
			color: '#fff'
		}

		var params = []
		for(var i in item.params){
			params.push(<div key = {i} className='piece-item-param'>{Math.round(item.params[i]*100)/100}</div>)
		}
		var picked = null
		if(item.picked == true && this.props.browser_tab != 'picked'){
			picked = <div className='overlay-item piece-item-picked' onClick={(function(e){s.showPieceList('picked');e.stopPropagation();})}><span className='icon-isight' /></div>
		}

		var active = this.props.current_type != null && this.props.current_type.id == type.id;

		var symbol_style = {
			color: 'rgb('+type.color[0]+','+type.color[1]+','+type.color[2]+')',
			background: 'rgb('+getC(type.color[0]-this.state.c_offset+(active ? 50 : 0))+','+getC(type.color[1]-this.state.c_offset+(active ? 50 : 0))+','+getC(type.color[2]-this.state.c_offset+(active ? 50 : 0))+')',
			boxShadow: 'inset rgba('+type.color[0]+','+type.color[1]+','+type.color[2]+',0.231373) 0px 0px 20px, rgba(0,0,0,0.3) 0px 0px 2px',
		}

		var store_style = {
			background: 'rgb('+type.color[0]+','+type.color[1]+','+type.color[2]+')',
			color: 'rgb('+getC(type.color[0]-this.state.c_offset+(active ? 50 : 0))+','+getC(type.color[1]-this.state.c_offset+(active ? 50 : 0))+','+getC(type.color[2]-this.state.c_offset+(active ? 50 : 0))+')',
			boxShadow: 'inset rgba('+type.color[0]+','+type.color[1]+','+type.color[2]+',0.231373) 0px 0px 20px, rgba(0,0,0,0.3) 0px 0px 2px',
		}

		// console.log(item)
		return (
			<GItem {...this.props} >
				<div className = 'piece-item' onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick = {this.load}>
					<div ref='bg' className = 'piece-item-bg' style={bg} />
					{picked}
					<span className = 'overlay-item piece-item-symbol' style={symbol_style}>{type.symbol}</span>
					<span onClick = {s.showStore.bind(null,item)} className = 'overlay-item piece-item-store ' style={store_style}><span className='icon-picture' /></span>
					<div className = 'overlay-item piece-item-stats' >
						<span>
							<span className="icon icon-heart" />
							<span className='span-heart'>{item.likes}</span>
							<span className="icon icon-eye" />
							<span className='span-eye'>{item.views}</span>
						</span>
					</div>
					
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
		var w = h = 1
		console.log(this.refs.wrapper.width())
		if(this.refs.wrapper.width() <= 400){
			w = 2
		}
		this.items = [];
		for(var i = 0;i<items.length;i++){
			var color = this.colors[props.browser_tab]
			if(items[i].picked){
				color = this.colors['picked']
			}else if(items[i].local){
				color = this.colors['saved']
			}
			
			if(items[i].picked == true && props.browser_tab == 'picked'){
				h = Math.random()<0.25 ? 2 : 1
			}else if(items[i].picked == true){
				h = 2
			}else{
				h = Math.random()<0.25 ? 2 : 1
			}
			this.items.push(<PieceItem current_type={props.current_type} type={props.type_items[items[i].type_id]} browser_tab={props.browser_tab} index = {i} ease_dur={0.5} delay={0.1}  w={w} h={h} color = {color} item = {items[i]} key = {props.browser_tab+'_piece_item_'+items[i].id+(items[i].local ? '_local' : '_')} />)
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
			
				<G ref = "grid" offset = {this.state.list_offset} fill_up={true} fixed={true} w = {2} h={3} list_id = {this.props.browser_tab} className='piece_list' style = {{height: 'calc(100% - 50px)'}} >
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
