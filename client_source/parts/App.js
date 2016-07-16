var react_redux = require('react-redux');
var connect = react_redux.connect;


var I = require('intui/parts/Slide');
var SlideMixin = require('intui/parts/SlideMixin');
var IButton = require('intui/parts/Button');
var G = require('intui/parts/Grid');
var GItem = require('intui/parts/GridItem');
var ITip = require('intui/parts/ToolTip');
var GMixin = require('intui/parts/GridMixin');
var UserWidget = require('./UserWidget');
var s = require('../state');
var IToggle = require('intui/parts/Form').ToggleField;


function getC(c){
	return (c < 0 ? 0 : Math.round(c))
}



















var Button = React.createClass({
	mixins: [SlideMixin],
	render: function(){
		var dir = null;
		if(this.props.down) dir = 'down'
		if(this.props.up) dir = 'up'
		if(this.props.right) dir = 'right'
		if(this.props.left) dir = 'left'

		return(
			<IButton beta = {this.props.beta} inverse = {this.props.inverse} dir={dir} onClick={this.props.onClick} height={this.props.height} width={this.props.width} active = {this.props.active} index_offset={4}>
				<div className = {'gui-button-layer'} style = {{background:this.props.c2,color:this.props.c1}}>
					<b className = {this.props.icon} />
				</div>
				<div className = {'gui-button-layer'} style = {{background:this.props.c1,color:this.props.c2}}>
					<b className = {this.props.icon} />
				</div>
			</IButton>
		)
	}
})



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
			<I {...this.props} id = 'sidebar' ref="sidebar" c="gui-sidebar" >
				<I vertical beta={100} offset={-this.props.width-this.props.width/2} ref = 'sidebar_top'>
					<Button inverse c1 = '#00B7FF' c2 ='#003850' down 	onClick={s.toggleBrowserTab.bind(null,'saved')}  height={this.props.width} icon= 'icon-database' active = {this.state.active_button == 3} />
					<Button inverse c1 = '#00FF76' c2 ='#003E1C' up 	onClick={s.toggleBrowserTab.bind(null,'recent')} height={this.props.width} icon= 'icon-leaf-1' active = {this.state.active_button == 0}  />
					<Button inverse c1 = '#FF0157' c2 ='#39000C' down 	onClick={s.toggleBrowserTab.bind(null,'liked')}  height={this.props.width} icon= 'icon-heart' active = {this.state.active_button == 1} />
					<Button right onMouseEnter={function(){console.log("test")}} inverse c1 = '#D6D6D6' c2 ='#111111' onClick={s.toggleTypesList} height={this.props.width} icon= 'icon-th-thumb' active = {this.props.show_types} index_offset={4} bClassName={'gui-button-layer'} />
					<I height={this.props.width} />
					
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
		s.showType(this.props.item)
	},

	render: function(){
		var active = this.props.current_type != null && this.props.current_type.id == this.props.item.id;
		var item = this.props.item;
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
					<span className='overlay-item piece-item-symbol' style={symbol_style} >{item.symbol}</span>
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
			
			<G fill_up={true} fixed={false} list_id = "piece_types" w= {1} h = {3} >
				{this.items}
			</G>
		
		)
	}
})


















var Browser = require('./Browser')


var Settings = React.createClass({
	mixins: [SlideMixin],

	toggleTips: function(){
		s.toggleTipDisplay(!this.props.show_tips)
	},
	render: function(){
		var size = 30;

		return(
			<I vertical beta = {this.props.beta} innerClassName = {'gui-settings'}>
				<I height = {50} outerClassName = 'gui-settings-option'>
					<IToggle onClick = { this.toggleTips } active = {this.props.show_tips} beta = {20} size = {size} color='#FFF9F9'  />
					<I beta = {80} innerClassName = 'gui-settings-option-slide'>
						<span>display tips</span>
					</I>
				</I>
			</I>
		)
	}
})















var App = React.createClass({

	getDefaultProps: function(){
		return {

		}
	},

	getInitialState: function(){
		return {
			hide_widget: true,
		}
	},

	componentDidMount: function(){

		console.log("MOUNTED")
		window.app = this;
	
	},

	showView: function(ee,e){
		console.log("SHOW VIEW")
		s.showView();
		ee.stopPropagation();
		// if(this.props.show_types && !this.props.show_browser) s.toggleTypesList();
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
			<I slide index_pos={this.props.show_info ? 1 : 0} vertical beta={100} ref = "root" >
				<I slide beta={100} index_pos = {this.props.show_browser ? 0 : 1} ref = "top" >
					
					<Browser 
						browser_tab = {this.props.browser_tab} 
						type_items = {this.props.type_items} 
						piece_items = {this.props.piece_items} 
						current_type = {this.props.current_type} 
						max_reached = {this.props.max_reached} 
						vertical 
						beta = {40} />
					
					<Sidebar slide show_settings = {this.props.show_settings} show_types = {this.props.show_types} show_browser = {this.props.show_browser} show_info ={this.props.show_info} browser_tab = {this.props.browser_tab} vertical width = {50} />
					
					<I outerClassName={'outer-view'} slide index_pos={this.props.show_types ? 0 : 1} beta={100} offset={-50} >
						
						<I beta = {40} c='type_list' >
							<TypeList current_type = {this.props.current_type} type_items = {this.props.type_items} />
						</I>
						
						
						
						<I beta = {100} id = 'view' ref = "view_slide">

							<canvas key = {this.props.current_type ? this.props.current_type.id : 0} id = 'view-canvas' className = 'view-canvas' ref='piece_canvas' />
							<UserWidget {...this.props} />
							
							<div className='view-overlay' onClick={this.showView} style={{pointerEvents: (this.props.show_browser || this.props.show_types || this.props.show_settings ) ? 'all' : 'none', 'opacity':(this.props.show_settings || this.props.show_browser || this.props.show_types) ? 0.85 : 0}} >
								<span className='icon-angle-left'></span>
								<span className='icon-angle-right'></span>
							</div>
						</I>
					</I>
					
					<div className='view-overlay'  onClick={this.showView} style={{pointerEvents: (this.props.show_store || this.props.show_info) ? 'all' : 'none', 'opacity':(this.props.show_store || this.props.show_info) ? 0.85 : 0}} >
						<span className='icon-angle-up' style = {{left:'65%'}}></span>
					</div>

				</I>
				<I beta = {100} offset = {-25} className='site-info'>
					<p>this site allows you to create different variations of webgl visuals. it uses thrrejs, glsl, react, redux, and a ui component library called intui used to display the different slides and grid.</p>
				</I>
			</I>
		)
	}
})

// ( !this.props.show_types && !this.props.show_store && !this.props.show_browser ) ? Bounce.easeOut : Power4.easeOut
module.exports = App;

