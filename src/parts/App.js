var intui = require('intui')
var Gui = require('./Gui');
var Info = require('./Info');
var I = require('intui').Slide;
var SlideMixin = require('intui').Mixin;
var G = require('intui').Grid;
var GItem = require('intui').GridItem;
var GMixin = require('intui').GridMixin;
var UserWidget = require('./UserWidget');
var s = require('../data/store')

function getC(c){
	return (c < 0 ? 0 : Math.round(c))
}


var TypeItem = React.createClass({
	mixins: [GMixin],
	getInitialState: function(){
		return {
			c_offset: 170,
		}
	},
	toggleHover: function(){
		this.setState({
			c_offset: this.state.c_offset == 170 ? 160 : 170
		})
	},
	render: function(){
		
		var item = this.props.item
		var style = {
			color: 'rgb('+item.color[0]+','+item.color[1]+','+item.color[2]+')',
			background: 'rgb('+getC(item.color[0]-this.state.c_offset)+','+getC(item.color[1]-this.state.c_offset)+','+getC(item.color[2]-this.state.c_offset)+')',
			boxShadow: 'inset rgba('+item.color[0]+','+item.color[1]+','+item.color[2]+',0.5) 0px 0px 1px, rgba(0,0,0,0.3) 0px 0px 2px',
		}

		return (
			<GItem {...this.props} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >
				<div className = 'type_item' style={style}>
					<span className = 'type_item_symbol'>{item.symbol}</span>
					<span className = 'type_item_name'>{item.name}</span>
					<span className = 'type_item_count'>{item.piece_count}</span>
				</div>
			</GItem>
		)
	}
})


var TypeList = React.createClass({
	getInitialState: function(){
		return {
			
		}
	},

	componentDidMount: function(){
		
	},

	shouldComponentUpdate: function(props,state){
		if(this.props.type_items.length != props.type_items.length){
			this.makeList(props.type_items)
		}
		return true
	},



	makeList: function(list){
		this.items = [];
		for(var i in list){
			this.items.push(<TypeItem item = {list[i]} key = {'type_item_'+i}  size_index = {0} />)
		}
	},

	items: [],
	render: function(){
		return (
			<I {...this.props} scroll vertical innerClassName='type_list' >
				<G>
					{this.items}
				</G>
			</I>
		)
	}

})



var App = React.createClass({

	getInitialState: function(){
		return {
			
		}
	},

	componentDidMount: function(){
		window.app = this;
		window.addEventListener('resize',function(){
			this.forceUpdate();
		}.bind(this))
		this.forceUpdate();
	},

	showView: function(ee,e){
		if(this.props.show_browser) s.toggleBrowser();
		if(this.props.show_types) s.toggleTypesList();

	},



	render: function(){
		return (
			<I slide index_pos={this.props.show_info ? 1 : 0} vertical beta={100} ref="root" >
				<I slide beta={100} ref="top" >
					<Gui {...this.props} id = 'gui' ref = 'gui' slide width={this.props.show_browser ? null : 50} beta={50} />
					<I slide index_pos={this.props.show_types ? 0 : 1} beta={100} offset={-50} >
						<I beta = {50} >
							<TypeList type_items = {this.props.type_items} />
						</I>
						<I beta = {100} id = 'view' onClick={this.showView} ref = "view-slide" style={{background:"#002131"}}>
							<canvas id = 'view-canvas' className = 'view-canvas' ref='piece_canvas' />
							<UserWidget {...this.props} />
							<div className='view-overlay' style={{pointerEvents: (this.props.show_browser || this.props.show_types) ? 'all' : 'none', 'opacity':(this.props.show_browser || this.props.show_types) ? 0.85 : 0}} />
						</I>
					</I>
				</I>
				<Info beta = {20}/>
			</I>
		)
	}
})


module.exports = App