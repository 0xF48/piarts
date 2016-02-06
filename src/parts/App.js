var intui = require('intui')


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












var TypesList = React.createClass({
	mixins: [SlideMixin],
	generateList: function(){
		this.typeslist = [];
		for( key in types){
			types[key]
		}
	},
	shouldComponentUpdate: function(props,state){
		if(props.typeslist.length != this.props.typeslist.length){
			this.generateList
		}
		return true;
	},
	render: function(){
		return (
			<I {...this.props} id="sidebar" ref="sidebar" outerClassName="gui-sidebar">
				<G style={{boxSizing:'border-box',padding:'0px'}} >
					{this.typeslist}	
				</G>
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
	toTypesList: function(){
		s.toggleTypesList()
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
					<InvButton c1 = '#C80041' c2 ='#30000A' left onClick={this.toBrowserLoved} height={this.props.width} icon= 'icon-heart' active = {this.state.active_button == 1} index_offset={3} />
					<InvButton c1 = '#E6B200' c2 ='#4B3A00' left onClick={this.toBrowserPicked} height={this.props.width} icon= 'icon-isight' active = {this.state.active_button == 2} index_offset={3} />
					<InvButton  c1 = '#FFDEBF' c2 ='#2A2828' right onClick={this.toTypesList} height={this.props.width} icon= 'icon-picture' active = {this.props.show_types} index_offset={3} />
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
			<I {...this.props} /*index_pos = {0} */ id='browser'>
				<I beta = {100} style = {{background:'#333333'}}>
					
				</I>
			</I>
		)
	}
})














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
		console.log("RENDER ME")
		// var p = this.props.pos

		// if(! this.props.toggle){
		// 	//this.styl.transform = 'translate('+(p == 'top' ? '-100%' : p == 'bottom' ? '100%' : '0%')+','+(p == 'left' ? '-100%' : p == 'right' ? '100%' : '0%')+')'
		// }else{

		// }


		return (
			<div ref = 'modal' className={this.props.className} style={this.styl}>
				{this.props.children}
			</div>
		)
	}
})



var TypeItem = React.createClass({
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
			this.items.push(<TypeItem item = {list[i]} key = {'type_item_'+i}  size_index = {3} />)
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
				<I slide beta={100} index_pos = {this.props.show_browser ? 0 : 1} ref="top" >
					<Browser show_types = {this.props.show_types} vertical beta = {40}/>		
					<Sidebar slide  show_types = {this.props.show_types} show_browser = {this.props.show_browser} show_info ={this.props.show_info} vertical width = {50} />
					<I slide index_pos={this.props.show_types ? 0 : 1} beta={100} offset={-50} >
						<I beta = {20} >
							<TypeList type_items = {this.props.type_items} />
						</I>
						<I beta = {100} id = 'view' onClick={this.showView} ref = "view-slide" style={{background:"#002131"}}>
							<canvas id = 'view-canvas' className = 'view-canvas' ref='piece_canvas' />
							<UserWidget {...this.props} />
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