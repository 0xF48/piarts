var C = require('circui').Circle;
var I = require('intui').Slide;
var React = require('react');
var connect = require('react-redux').connect;
var CLoader = require('circui').Loader;
var s = require('../store.js');
var UserWidget = React.createClass({

	getDefaultProps: function(){
		return {
			size: 100
		}
	},
	componentDidMount: function(){
		window.root_node = this.refs.root_node;
		window.widget = this;
		// window.addEventListener("resize",function(){
		// 	this.forceUpdate()
		// }.bind(this));
	},

	getInitialState: function(){
		return {
			unique: false,
			saving: false,
			sharing: false,
			root_expanded: false,
		}
	},

	contextTypes: {
		state: React.PropTypes.object,
	},

	toggle: function(){
		this.setState({
			saved: !this.state.saved
		})
	},

	shouldComponentUpdate: function(props,state){

		if(state.root_expanded != this.state.root_expanded){
			this.refs.root_node.setState({
				expanded:state.root_expanded ? true : false})

			if(state.root_expanded == false && state.sharing){
				this.toDefault(state);
				return false;
			} 
			

			if(state.saving) this.toSaving(state);

			if(state.sharing) this.toSharing(state);
			return false
		}

		if(props.saving_piece && !this.props.saving_piece){
			console.log("UPDATE- SAVING")

			this.toSaving(state);


			return false
		}
		if(!props.saving_piece && this.props.saving_piece){

			this.toSharing(state);
			console.log("UPDATE- SHARING")

			return false
		}
		if(state.sharing == false && state.saving == false && (this.state.sharing != false || this.state.saving != false)){
			this.toDefault(state);
			return false;
		}
		return true
		//console.log("SHOULD WIDGET UPDATE???",this.props.saving_piece);
	},


	toSaving: function(state){
		this.refs.loader.setState({
			ease:Power4.easeOut,
			c_r: 0,
			c_g: 255,
			c_b: 255,
			d: 1,
			angle_start:0,
			angle_end: Math.PI,
		})

		this.setState(Object.assign(state,{
			saving: true,
			sharing: false
		}))
	},

	toSharing: function(state){
		this.refs.share_node.setState({
			expanded: true
		})
	
		this.refs.loader.setState({
			c_r: 0,
			c_g: 255,
			c_b: 0,
			d: 0.5,
			angle_start:0,
			angle_end: Math.PI*2,
		//	width: 3
		})

		this.refs.slide.to({
			ease: Elastic.easeOut,
			beta: 100,
			dur: 0.5,
		});

		this.setState(Object.assign(state,{
			saving: false,
			sharing: true
		}))
	},

	toDefault: function(state){
		this.refs.share_node.setState({
			expanded: false
		})
	
		this.refs.loader.setState({
			c_r: 255,
			c_g: 255,
			c_b: 255,
			d: 0.5,
			angle_start:0,
			angle_end: 0,
		})

		this.refs.slide.to({
			ease: Power3.easeOut,
			beta: 0,
			dur: 0.5,
		});

		this.setState(Object.assign(state,{
			saving: false,
			sharing: false
		}))
	},

	// componentWillUpdate: function(props,state){
	// 	console.log("WILL UPDATE",this.state,'->',state);
	

	// },

	componentDidMount: function(){
		window.node = this.refs.slide
		window.widget = this;

	//	this.saveShare();
	},

	saveShare: function(){

		if(this.props.saving_piece || this.state.sharing) return
		this.toSaving(this.state);
		// this.setState({
		// 	sharing: false,
		// 	saving: true
		// })

		s.saveCurrentPiece()

		
	},

	render_saver: function(){
		console.log("RENDER USER WIDGET",this.props.saving_piece);
		return (
			<C padding={7} distance={1.1} className='share_node' ref='share_node' beta={50} onClick={this.saveShare}>
				<div className='share-slide-container'>
					<CLoader ref = 'loader' className='loader' color='#2F8BAD' c_r={0} c_g={255} c_b={0} radius={this.props.size/4} width={3} />
					<I relative slide v beta={100} ref='slide' className='share_slide'>
						<I beta={100} className='share-slide-favorite'>
							<b className='icon-star' />
						</I>
						<I beta={100} className='share-slide-share'>
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
	},

	toggle_root: function(){
		this.setState({
			root_expanded: !this.state.root_expanded
		})
	},

	render: function(){
		return (
			<div id = 'user-widget'>
				<C  ref='root_node' onClick={this.toggle_root} size={this.props.size} angle = {-Math.PI/2} width={4} >
					<b className='icon-cog' />
					<C distance={1.1} className="love_node" ref='love_node' beta={50}>
						<b className='icon-heart' />
					</C>
					<C distance={1.1} ref='love_node' beta={50}>
						<b className='icon-pause' />
					</C>

					{this.render_saver()}
				</C>
			</div>
		)
	}
});

module.exports = connect(function(state){
	return {
		saving_piece: state.saving_piece
	}
})(UserWidget)

