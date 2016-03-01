var intui = require('intui');


var react_redux = require('react-redux');
var connect = react_redux.connect;

var I = require('intui').Slide;
var SlideMixin = require('intui').Mixin;
var Button = require('intui').Button;
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
			active_button: -1,
			fullscreen: false
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


	toggleFullscreen: function(){
		var elem = document.body

		if(this.state.fullscreen == true){
			console.log('exit fullscreen')
			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.msExitFullscreen) {
			 document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			}
		}else{
			if (elem.requestFullscreen) {
			  elem.requestFullscreen();
			} else if (elem.msRequestFullscreen) {
			  elem.msRequestFullscreen();
			} else if (elem.mozRequestFullScreen) {
			  elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
			  elem.webkitRequestFullscreen();
			}			
		}
		

		this.setState({
			fullscreen: !this.state.fullscreen
		})
	},

	componentDidMount: function(){

		// window.sidebar = this.refs['sidebar']
		// window.sidebar_top = this.refs['sidebar_top']
	},
	render: function(){
		return (
			<I {...this.props} id = 'sidebar' ref="sidebar" outerClassName="gui-sidebar" >
				<I vertical beta={100} offset={-this.props.width-this.props.width/2} ref = 'sidebar_top'>
					<Button inverse c1 = '#00B7FF' c2 ='#003850' down 	onClick={s.showPieceList.bind(null,'saved')} height={this.props.width} icon= 'icon-database' active = {this.state.active_button == 3} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#00FF76' c2 ='#003E1C' up 	onClick={s.showPieceList.bind(null,'recent')} height={this.props.width} icon= 'icon-leaf-1' active = {this.state.active_button == 0} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#FF0157' c2 ='#39000C' down 	onClick={s.showPieceList.bind(null,'liked')} height={this.props.width} icon= 'icon-heart' active = {this.state.active_button == 1} index_offset={4} bClassName={'gui-button-layer'} />
					<Button inverse c1 = '#FFCB00' c2 ='#3A2E00' up 	onClick={s.showPieceList.bind(null,'picked')} height={this.props.width} icon= 'icon-isight' active = {this.state.active_button == 2} index_offset={4} bClassName={'gui-button-layer'} />
					<Button right onMouseEnter={function(){console.log("test")}} ease={Bounce.easeOut} inverse c1 = '#D6D6D6' c2 ='#111111' onClick={s.toggleTypesList} height={this.props.width} icon= 'icon-th-thumb' active = {this.props.show_types} index_offset={4} bClassName={'gui-button-layer'} />
				</I>
	
				<Button inverse c1 = '#D6D6D6' c2 ='#111111' up 	onClick={this.toggleFullscreen} height={this.props.width/2} icon= 'icon-angle-up' icon_alt= 'icon-angle-down' active = {this.state.fullscreen} index_offset={4} bClassName={'gui-button-layer'} />
				<Button  inverse c1 = '#D6D6D6' c2 ='#111111' down 	onClick={this.showInfo} height={this.props.width} icon= 'icon-info-circled' active = {this.props.show_info} index_offset={4} bClassName={'gui-button-layer'} />
			
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

	showType: function(){
		s.loadType(this.props.item,function(item){
			s.setType(item)
			s.saveParams(item.params)
			s.showView()
		});
	},

	render: function(){
		var active = this.props.current_type != null && this.props.current_type.id == this.props.item.id;
		var item = this.props.item
		var symbol_style = {
			color: 'rgb('+item.color[0]+','+item.color[1]+','+item.color[2]+')',
			background: 'rgb('+getC(item.color[0]-this.state.c_offset+(active ? 50 : 0))+','+getC(item.color[1]-this.state.c_offset+(active ? 50 : 0))+','+getC(item.color[2]-this.state.c_offset+(active ? 50 : 0))+')',
			boxShadow: 'inset rgba('+item.color[0]+','+item.color[1]+','+item.color[2]+',0.231373) 0px 0px 20px, rgba(0,0,0,0.3) 0px 0px 2px',
		}

		var global_style = {
			color: 'rgb('+item.color[0]+','+item.color[1]+','+item.color[2]+')',
		}

		var bg = {
			background: 'url('+( (this.props.w == 1 && this.props.h == 1)  ? item.preview.small : item.preview.medium)+') center',
		}



		return (
			<GItem {...this.props} onClick = {this.showType} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >
				
				<div className = 'type-item' style = {global_style}>
					<div ref='bg' className = ' type-item-bg' style={bg} />
					<span className='overlay-item type-item-symbol' style={symbol_style} >{item.symbol}</span>
					<span className="overlay-item type-item-name" >{item.name}</span>
					<div className = 'overlay-item type-item-count' >
						<span style = {global_style}>
							<span className="icon icon-spread"/>
							<span className="type-item-count-pieces">{item.piece_count}</span>
							<span className="icon icon-sliders"/>
							<span className="type-item-count-params">{item.params.length}</span>
						</span>
					</div>
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
			this.items.push(<TypeItem current_type = {this.props.current_type} item = {list[i]} key = {'type_item_'+i}  w = {1} h = {1} />)
		}
	},

	items: [],
	render: function(){

		return (
			<I {...this.props} scroll vertical outerClassName='type_list' >
				<G fill_up={true} fixed={true} list_id = "piece_types" w= {1} h = {3} >
					{this.items}
				</G>
			</I>
		)
	}
})


















var Browser = require('./Browser')




















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
		if(this.props.show_info) s.showView();
		if(this.props.show_browser) s.toggleBrowser();
		if(this.props.show_types && !this.props.show_browser) s.toggleTypesList();

	},

	componentDidUpdate: function(props){

		

		if(this.props.view_paused != props.view_paused){
			s.toggleView(this.props.view_paused)
		}

		if(this.refs.piece_canvas){
			this.refs.piece_canvas.width = this.refs.piece_canvas.parentElement.clientWidth;
			this.refs.piece_canvas.height = this.refs.piece_canvas.parentElement.clientHeight;
		}

		if(this.props.current_type != props.current_type){
			s.initCurrentType()
		}

	},


	render: function(){
		

		return (
			<I ease={Power4.easeOut} duration={0.5} slide index_pos={this.props.show_info ? 1 : 0} vertical beta={100} ref="root" >
				<I slide beta={100} index_pos = {this.props.show_browser ? 0 : 1} ref="top" >
					<I vertical slide beta = {40} >
						<Browser {...this.props} vertical beta = {100}/>
					</I>
					
					<Sidebar slide  show_types = {this.props.show_types} show_browser = {this.props.show_browser} show_info ={this.props.show_info} browser_tab = {this.props.browser_tab} vertical width = {50} />
					<I outerClassName={'outer-view'} slide index_pos={this.props.show_types ? 0 : 1} beta={100} offset={-50} >
						<TypeList beta = {40} current_type = {this.props.current_type} type_items = {this.props.type_items} />
						<I beta = {100} id = 'view' onClick={this.showView} ref = "view-slide">
							<canvas key = {this.props.current_type ? this.props.current_type.id : 0} id = 'view-canvas' className = 'view-canvas' ref='piece_canvas' />
							<UserWidget {...this.props} ref='widget' />
							<div className='view-overlay' style={{pointerEvents: (this.props.show_browser || this.props.show_types || this.props.show_info) ? 'all' : 'none', 'opacity':(this.props.show_browser || this.props.show_types || this.props.show_info) ? 0.85 : 0}} >
								<span className='icon-angle-left'></span>
								<span className='icon-angle-up'></span>
							</div>
						</I>
					</I>
				</I>
				<I   beta = {100} offset = {-25} outerClassName='site-info-outer' innerClassName='site-info'>
					<p>piarts is a site where you can create and order prints of digitally generated artwork.</p>
					<br/>
				</I>
			</I>
		)
	}
})


module.exports = App