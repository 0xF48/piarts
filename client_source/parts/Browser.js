
var react_redux = require('react-redux');
var connect = react_redux.connect;


var I = require('intui/parts/Slide');
var SlideMixin = require('intui/parts/SlideMixin');
var G = require('intui/parts/Grid');
var GItem = require('intui/parts/GridItem');
var ITip = require('intui/parts/ToolTip');
var GMixin = require('intui/parts/GridMixin');


var s = require('../state')


function getC(c){
	return (c < 0 ? 0 : Math.round(c))
}
var PieceItem = React.createClass({
	mixins: [GMixin],
	getInitialState: function(){
		this.image_set = false;
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
		s.showPiece(this.props.item);
		e.stopPropagation();
	},

	toggleHover: function(toggle){
		this.setState({
			toggle_bg: toggle
		})
		// TweenLite.set(this.refs.bg,{
		// 	// rotationZ: !this.state.toggle_bg ? 10 * (Math.random()<0.5 ? -1 : 1):0,
		// 	// ease: Power2.easeOut,
		// 	webkitFilter: 'blur('+(toggle ? 5 : 0)+'px)'
		// })
	},

	showStore: function(e){
		s.showStore(this.props.item)
		e.stopPropagation();
	},

	componentDidMount: function(){
		this.refs.canvas.height = 500
		this.refs.canvas.width = 500
		if(!this.image_set){
			s.renderPiece(this.refs.canvas,this.props.item,500)
			this.image_set = true
		}
		
	},

	render: function(){
		// console.log(this.props.item.created_at)

		var item = this.props.item;
		var type = this.props.item.type;


		var type_style = {
			color: '#fff'
		}

		var params = []
		for(var i in item.params){
			params.push(<div key = {i} className='piece-item-param'>{Math.round(item.params[i]*100)/100}</div>)
		}
		var picked = null
		if(item.picked == true && this.props.browser_tab != 'picked'){
			picked = <div className='overlay-item piece-item-picked' onClick={(function(e){s.toggleBrowserTab('picked');e.stopPropagation();})}><span className='icon-isight' /></div>
		}

		var active = this.props.current_type != null && this.props.current_type._id == type._id;

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

		return (
			<GItem {...this.props} >
				<div ref = 'item' className = 'piece-item' onMouseEnter={this.toggleHover.bind(this,true)} onMouseLeave={this.toggleHover.bind(this,false)} onClick = {this.load}>
					<canvas ref = 'canvas'></canvas>
					
					<div className = {'piece-item-overlay ' + ( !this.state.toggle_bg ? 'piece-item-overlay-hidden' : '') }>
						<b className='icon-isight'></b>
					</div>
					{picked}
					<span className = 'overlay-item piece-item-symbol' style={symbol_style}>{type.symbol}</span>
					<div className = 'overlay-item piece-item-date' >
						<span>{item.created_at.toDateString()}</span>
					</div>
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

	

	getInitialState: function(){
		this.items = []
		return {
			list_offset: 0,
			page_index: 0,
			items_per_page: 10,
		}
	},

	makeList: function(props,state,items){
		var w = h = 1
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
			this.items.push(<PieceItem current_type={props.current_type} type={props.type_items[items[i].type_id]} browser_tab={props.browser_tab} index = {i} w={w} h={h} color = {color} item = {items[i]} key = {props.browser_tab+'_piece_item_'+items[i].id+(items[i].local ? '_local' : '_')} />)
		}
	},

	componentWillUpdate: function(props,state){
		if( ! props.piece_items[props.browser_tab] ) return false
		if(this.props.browser_tab != props.browser_tab || this.items.length != props.piece_items[props.browser_tab].length){
			this.makeList(props,state,props.piece_items[props.browser_tab])
			state.list_offset = 0;			
		}
		
		return true
	},

	update: function(){
		s.updatePieceList(this.props.browser_tab)
	},

	componentDidMount: function(){
		window.browser = this
	},

	render: function(){
		// console.log(this.props.max_reached[this.props.browser_tab])
		return (
			<I beta = {this.props.beta} vertical outerClassName = 'piece_list_wrapper' scroll ref="wrapper">
				<G 
					className= 'piece_list'
					list_id = {this.props.browser_tab}
					key = {this.props.browser_tab}
					update_offset_beta = {1}
					max_grid_height_beta = {4}
					max_reached = {this.props.max_reached[this.props.browser_tab]} 
					native_scroll = {true}
					ref = "grid"
					beta = {100} 
					w = {2} 
					onUpdate = {this.update}
					fixed = {false} >
					
					{this.items}
				</G>
			</I>
		)
	}
})




module.exports = Browser
