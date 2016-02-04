var C = require('circui').Circle;
var I = require('intui').Slide;
var React = require('react');
var connect = require('react-redux').connect;
var CLoader = require('circui').Loader;
var s = require('../store.js');
var ParamWidget = require('./ParamWidget');
var CircleMixin = require('circui').Mixin;


var SaveWidget = React.createClass({

	mixins: [CircleMixin],

	getInitialState: function(){
		return {
			saving: false,
			sharing: false
		}
	},

	getDefaultProps: function(){
		return {
			saving: false
		}
	},

	shouldComponentUpdate: function(props,state){
		if(props.saving != this.props.saving){
			this.setState({
				saving: props.saving,
			})
			return true
		}

		else if(this.state.saving == true && state.saving == false && this.state.sharing == false){
			this.setState({
				sharing: true
			})
			return true
		}

		//save loader done
		else if(state.sharing != this.state.sharing && state.saving == true && state.sharing == true){
			this.refs.loader.setState({
				c_r: 0,
				c_g: 255,
				c_b: 0,
				d: 0.5,
				angle_start:0,
				angle_end: Math.PI*2,
			})

		//save loader start
		}else if(this.state.saving != state.saving && state.saving == true && state.sharing == false){
			this.refs.loader.setState({
				ease:Power4.easeOut,
				c_r: 0,
				c_g: 255,
				c_b: 255,
				d: 1,
				angle_start:0,
				angle_end: Math.PI,
			})	

		//default loader
		}else if(this.state.saving != state.saving && state.sharing == false && state.saving == false){
			this.refs.loader.setState({
				c_r: 255,
				c_g: 255,
				c_b: 255,
				d: 0.5,
				angle_start:0,
				angle_end: 0,
			})
		}

		return true
	},	

	saveShare: function(){
		if(this.props.saving_piece || this.state.sharing){
			this.setState({
				sharing: false
			})
		}

		this.setState({
		 	sharing: false,
		 	saving: true
		})

		s.saveCurrentPiece()
	},

	componentDidMount: function(){
		console.log(this.refs['root'])
		window.tt = this.refs['root']
	},


	render: function(){
		return (
			<C {...this.props} padding={7}  className='share_node' ref='root' expanded={this.props.sharing}  onClick={this.saveShare}>
				<div className='share-slide-container'>
					<CLoader ref = 'loader' className='loader' color='#2F8BAD' c_r={0} c_g={255} c_b={0} radius={70/4} width={3} />
					<I slide v beta={100} ref='slide' index = {this.sharing ? 1 : 0} className='share_slide'>
						<I beta={100} classNameInner='share-slide-favorite'>
							<b className='icon-star' />
						</I>
						<I beta={100} classNameInner='share-slide-share'>
							<b className='icon-paper-plane' />
						</I>	
					</I>
					
				</div>
				<C distance={1} ref='share_node_tr' beta={70}>
					<b className='icon-twitter' />
				</C>
				<C distance={1} ref='share_node_fb' beta={70}>
					<b className='icon-facebook-1' />
				</C>
			</C>
		)
	}
})











var UserWidget = React.createClass({

	componentDidMount: function(){
		window.widget = this;
		this.refs.param_widget.initDragger(this.refs.canvas);
	},

	componentDidUpdate: function(){
		this.syncCanvasDragger();
	},

	syncCanvasDragger: function(){
		var canvas_pos = this.refs.canvas.getBoundingClientRect();
		this.refs.canvas.width = this.refs['root'].clientWidth;
		this.refs.canvas.height = this.refs['root'].clientHeight;
		this.refs.param_widget.dragger.stage['vertical'] = this.refs.canvas.height > this.refs.canvas.width ? true : false
		this.refs.param_widget.dragger.stage['left'] = canvas_pos.left
		this.refs.param_widget.dragger.stage['top'] = canvas_pos.top
	},

	getInitialState: function(){
		return {
			expanded: false,
		}
	},

	toggleRoot: function(){
		this.setState({
			expanded: !this.state.expanded
		})
	},


	render: function(){
		return (
			<div className = 'user-widget' ref = 'root'>
				<canvas  tabIndex='1' ref='canvas' className = 'user-widget-canvas' />
				<C rootStyle={{top:'50%'}} rootClass = 'user-widget-dom' ref='root_node' expanded={this.state.expanded} onClick={this.toggleRoot} size={85} angle = {-Math.PI/2} >
					<b className='icon-cog' />
					<C distance={1.3}  beta={45} selfClass="love_node" ref='love_node'>
						<b className='icon-heart' />
					</C>
					<ParamWidget distance={1.1} beta={100} ref='param_widget' expanded={this.state.expanded} params={this.props.params}/>
					<SaveWidget distance={1.3} beta={45} ref='save_widget' saving={this.props.saving_piece} />

				</C>		
			</div>
		)
	}
});

module.exports = UserWidget
