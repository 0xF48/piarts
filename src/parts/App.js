var intui = require('intui');


var react_redux = require('react-redux');
var connect = react_redux.connect;

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

/* intui layout methods */

var Modal = React.createClass({
	getDefaultProps: function(){
		return {
			toggle: false
			,pos: 'top'
			,easeIn: Bounce.easeOut
			,easeOut: Expo.easeIn
			,durIn: 0.6
			,durOut: 0.4
		}
	}
	,componentDidMount: function(){
		//this.styl.display = 'initial'
		var p = this.props.pos
		var d = this.getDim();
		//window.addEventListener('resize',this.forceUpdate);
		TweenLite.set(this.refs.modal,{
			x: (p == 'left' ? -d[0] : p == 'right' ? d[0] : 0)
			,y:  (p == 'top' ? -d[1] : p == 'bottom' ? d[1] : 0)

		})
	}
	,getDim: function(){
		return [this.refs.modal.clientWidth,this.refs.modal.clientHeight]
	}
	,componentWillUpdate: function(props){
		if(props.toggle == this.props.toggle){
			var p = this.props.pos
			var d = this.getDim();
			if(!props.toggle){
				TweenLite.set(this.refs.modal,{
				 	x: (p == 'left' ? -d[0] : p == 'right' ? d[0] : 0)
				 	,y: (p == 'top' ? -d[1] : p == 'bottom' ? d[1] : 0)
				})				
			}else{
				TweenLite.set(this.refs.modal,{
				 	x:0
				 	,y: 0
				})					
			}

		}

		// TweenLite.set(this.refs.modal,{
		// 	x: (p == 'top' ? -d[1] : p == 'bottom' ? d[1] : 0)
		// 	,y: (p == 'left' ? -d[0] : p == 'right' ? d[0] : 0)
		// })
	}
	,componentDidUpdate: function(props){
		//console.log('UPDATED',this.props.toggle)
		var p = this.props.pos
		var d = this.getDim();
		if(this.props.toggle != props.toggle){
			if(this.props.toggle){
				TweenLite.to(this.refs.modal,this.props.durIn,{
					x: 0
					,y: 0
					,ease: this.props.easeIn
				})
			}else{
				TweenLite.to(this.refs.modal,this.props.durOut,{
					y: (p == 'top' ? -d[1] : p == 'bottom' ? d[1] : 0)
					,x: (p == 'left' ? -d[0] : p == 'right' ? d[0] : 0)
					,ease: this.props.easeOut
				})				
			}
		}
	}

	,styl: {
		height: '100%'
		,width: '100%'
		,top:'0'
		,left: '0'
		,position: 'absolute'
		,zIndex: 10
	}

	,render: function(){
		return (
			<div ref = 'modal' className={this.props.className} style={this.styl}>
				{this.props.children}
			</div>
		)
	}
})

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
			index_offsset_full: false,
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
			var icon = <span className={this.props.icon}></span>
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
		
		if(this.props.index_offset_full && this.state.hover){
			index_offset = 0
			index_pos = index_pos == 1 ? 0 : 1
		}

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

/* intui layout methods */
























var Sidebar = React.createClass({
	mixins: [SlideMixin],
	// getDefaultProps: function(){
	// 	return {
	// 		width: null
	// 	}
	// },
	getInitialState: function(){
		return {
			active_button: -1
		}
	},
	showInfo: function(){
		s.toggleInfo()
	},
	componentWillReceiveProps: function(props){
		if(props.show_browser == false){
			this.setState({active_button:-1})
		}else{
			var tab = props.browser_tab;
			this.setState({
				active_button: tab == 'recent' ? 0 : tab == 'liked' ? 1 : tab == 'picked' ? 2 : tab == 'saved' ? 3 : -1
			})	
		}
	},

	componentDidMount: function(){

		// window.sidebar = this.refs['sidebar']
		// window.sidebar_top = this.refs['sidebar_top']
	},
	render: function(){
		return (
			<I {...this.props} id = 'sidebar' ref="sidebar" outerClassName="gui-sidebar" >
				<I vertical beta={100} offset={-50} ref = 'sidebar_top'>
					<InvButton c1 = '#99D4DB' c2 ='#34494C' left 	onClick={s.showPieceList.bind(null,'saved')} height={this.props.width} icon= 'icon-floppy' active = {this.state.active_button == 3} index_offset={3} />
					<InvButton c1 = '#00C85C' c2 ='#003016' left 	onClick={s.showPieceList.bind(null,'recent')} height={this.props.width} icon= 'icon-leaf-1' active = {this.state.active_button == 0} index_offset={3} />
					<InvButton c1 = '#C80041' c2 ='#30000A' left 	onClick={s.showPieceList.bind(null,'liked')} height={this.props.width} icon= 'icon-heart' active = {this.state.active_button == 1} index_offset={3} />
					<InvButton c1 = '#E6B200' c2 ='#4B3A00' left 	onClick={s.showPieceList.bind(null,'picked')} height={this.props.width} icon= 'icon-isight' active = {this.state.active_button == 2} index_offset={3} />
					<InvButton c1 = '#FFDEBF' c2 ='#2A2828' right 	onClick={s.toggleTypesList} height={this.props.width} icon= 'icon-th-thumb' active = {this.props.show_types} index_offset={3} />
				</I>
				<InvButton c1 = '#FFDEBF' c2 ='#2A2828' down 	onClick={this.showInfo} height={this.props.width} icon= 'icon-info-circled' active = {this.props.show_info} index_offset={3} />
			</I>
		)
	}
})



































var TypeItem = connect(function(state){
	return {
		current_type: state.current_type
	}
})(React.createClass({
	mixins: [GMixin],

	getInitialState: function(){
		return {
			c_offset: 170
			,toggle_modal: false
		}
	},

	toggleHover: function(){
		this.setState({
			c_offset: this.state.c_offset == 170 ? 160 : 170,
			toggle_modal: this.props.item.locked ? true : this.state.toggle_modal
		})
	},

	load: function(){
		s.loadType(this.props.item,function(item){
			console.log('loaded',item)
			s.setCurrentType(item)
			s.showView()
		});
	},

	render: function(){
		var active = this.props.current_type != null && this.props.current_type.id == this.props.item.id;
		var item = this.props.item
		var style = {
			color: 'rgb('+item.color[0]+','+item.color[1]+','+item.color[2]+')',
			background: 'rgb('+getC(item.color[0]-this.state.c_offset+(active ? 50 : 0))+','+getC(item.color[1]-this.state.c_offset+(active ? 50 : 0))+','+getC(item.color[2]-this.state.c_offset+(active ? 50 : 0))+')',
			boxShadow: 'inset rgba('+item.color[0]+','+item.color[1]+','+item.color[2]+',0.5) 0px 0px 1px, rgba(0,0,0,0.3) 0px 0px 2px',
		}

		return (
			<GItem {...this.props} onClick = {this.load} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >
				
				<div className = 'type_item' style={style}>
					<Modal easeOut={Power3.easeOut} pos = 'top' className = 'type_item_modal' toggle={this.state.toggle_modal} >
						<b className='icon-lock'></b>
					</Modal>
					<span className = 'type_item_symbol'>{item.symbol}</span>
					<span className = 'type_item_name'>{item.name}</span>
					<span className = 'type_item_count'>{item.piece_count}</span>
				</div>
			</GItem>
		)
	}
}))



var TypeList = React.createClass({
	mixins: [SlideMixin],
	getInitialState: function(){
		return {
			
		}
	},

	componentDidMount: function(){
		
	},

	shouldComponentUpdate: function(props,state){
		if(Object.keys(this.props.type_items).length != Object.keys(props.type_items).length){
			this.makeList(props.type_items)
		}
		return true
	},

	makeList: function(list){
		this.items = [];
		for(var i in list){
			this.items.push(<TypeItem current_type = {this.props.current_type} item = {list[i]} key = {'type_item_'+i}  size_index = {3} />)
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
	render: function(){
		return (
			<I beta={this.props.beta} slide index_pos={this.getPos()}  id='browser'>
				<PieceList  items = {this.props.piece_items.recent} ref = 'recent_list' beta = {100} />
				<PieceList  items = {this.props.piece_items.liked}  ref = 'liked_list' beta = {100} />
				<PieceList  items = {this.props.piece_items.picked} ref = 'picked_list' beta = {100} />
				<PieceList  items = {this.props.piece_items.saved} ref = 'saved_list' beta = {100} />
			</I>
		)
	}
})







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
		// s.loadType(this.props.item,function(item){
		// 	console.log('loaded',item)
		// 	s.setCurrentType(item)
		// 	s.showView()
		// });
	},
	render: function(){

		var item = this.props.item;
		var style = {
			color: '#000',
			background:  '#fff'
		}

		return (
			<GItem {...this.props} onClick = {this.load}  >
				<div className = 'piece_item' style={style}>
					{item.id}
				</div>
			</GItem>
		)
	}
})



var PieceList = React.createClass({
	mixins: [SlideMixin],
	getInitialState: function(){
		return {
			
		}
	},

	componentDidMount: function(){
		
	},
	componentWillReceiveProps: function(props){
		if(this.props.items.length != props.items.length){
			this.makeList(props.items)
		}
	},
	

	makeList: function(list){
		this.items = [];
		for(var i in list){
			this.items.push(<PieceItem item = {list[i]} key = {'piece_item_'+list[i].id}  size_index = { list[i].local == true ? 3 : 0 } />)
		}
	},

	items: [],
	render: function(){

		return (
			<I beta = {this.props.beta} scroll vertical innerClassName='piece_list'>
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
			hide_widget: true,
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
		if(this.props.show_types && !this.props.show_browser) s.toggleTypesList();

	},

	componentDidUpdate: function(props){

		if(this.props.current_type != props.current_type){
			if(this.props.current_type != null){
				s.setView(this.refs.piece_canvas)
			}else{
				s.clearView()
			}
		}

		if(this.props.view_paused != props.view_paused){
			s.toggleView(this.props.view_paused)
		}

	},


	render: function(){
		return (
			<I slide index_pos={this.props.show_info ? 1 : 0} vertical beta={100} ref="root" >
				<I slide beta={100} index_pos = {this.props.show_browser ? 0 : 1} ref="top" >
					<Browser {...this.props} vertical beta = {40}/>
					<Sidebar slide  show_types = {this.props.show_types} show_browser = {this.props.show_browser} show_info ={this.props.show_info} browser_tab = {this.props.browser_tab} vertical width = {50} />
					<I slide index_pos={this.props.show_types ? 0 : 1} beta={100} offset={-50} >
						<TypeList beta = {20} current_type = {this.props.current_type} type_items = {this.props.type_items} />
						<I beta = {100} id = 'view' onClick={this.showView} ref = "view-slide" style={{background:"#002131"}}>
							<canvas id = 'view-canvas' className = 'view-canvas' ref='piece_canvas' />
							<UserWidget {...this.props} ref='widget' />
							<div className='view-overlay' style={{pointerEvents: (this.props.show_browser || this.props.show_types) ? 'all' : 'none', 'opacity':(this.props.show_browser || this.props.show_types) ? 0.85 : 0}} >
								<span className='icon-angle-left'></span>
							</div>
						</I>
					</I>
				</I>
				<I beta = {20} innerClassName='site-info'>
					<p>piarts is a site where you can create and order prints of digitally generated artwork.</p>
					<br/>
				</I>
			</I>
		)
	}
})


module.exports = App