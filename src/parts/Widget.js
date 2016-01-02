var C = require('circui').Circle;
var I = require('intui').Slide;
var React = require('react');
var connect = require('react-redux').connect;
var CLoader = require('circui').Loader;
var s = require('../store.js');
var Widget = React.createClass({

	getDefaultProps: function(){
		return {
			size: 120
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
		if(props.saving_piece && !this.state.saving){
			this.setState(Object.assign(state,{
				saving: true,
				sharing: false
			}))
			return false
		}
		if(!props.saving_piece && this.state.saving){
			this.setState(Object.assign(state,{
				saving: false,
				sharing: true
			}))
			return false
		}
		return true
		//console.log("SHOULD WIDGET UPDATE???",this.props.saving_piece);
	},

	componentWillUpdate: function(props,state){
		if(state.root_expanded != this.state.root_expanded){
			if(!state.root_expanded){
				state.sharing = false;
				state.saving = false
			}
			this.refs.root_node.setState({expanded:state.root_expanded ? true : false})
		}
		//this.refs.slide.forceUpdate();
		//console.log(state,this.state)
		if(state.saving == true && !this.state.saving){
			console.log("SAVING")
			this.refs.loader.setState({
				c_r: 0,
				c_g: 255,
				c_b: 255,
				d: 5,
				angle_start:0,
				angle_end: Math.PI,
			})

			// setTimeout(function() {
			// 	this.setState({
			// 		sharing: true
			// 	})
			// }.bind(this), 1000);
		}




		if(this.state.sharing != state.sharing){

			this.refs.share_node.setState({
				expanded: state.sharing ? true : false
			})
		
			this.refs.loader.setState({
				c_r: 0,
				c_g: 255,
				c_b: state.saving ? 255 : 0,
				d: 0.3,
				angle_start:0,
				angle_end: state.saving ? Math.PI*2 : 0,
			//	width: 3
			})

			this.refs.slide.to({
				ease: Elastic.easeOut,
				beta: state.sharing ? 100 : 0,
				dur: 0.5,
			});
		}

	},

	componentDidMount: function(){
		window.node = this.refs.slide
		window.widget = this;

	//	this.saveShare();
	},

	saveShare: function(){

		if(this.props.saving_piece) return

		this.setState({
			sharing: false,
			saving: true
		})
		s.saveCurrentPiece()
	},

	share_render: function(){
		console.log("RENDER WIDGET",this.props.saving_piece);
		return (
			<C padding={7} className='share_node' ref='share_node' beta={50} onClick={this.saveShare}>
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
				<C ref='share_node_tr' beta={70}>
					<b className='icon-twitter' />
				</C>
				<C ref='share_node_fb' beta={70}>
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
			<div id = 'widget'>
				<C ref='root_node' onClick={this.toggle_root} size={this.props.size} angle = {-Math.PI/2} width={4} >
					<b className='icon-cog' />
					<C className="love_node" ref='love_node' beta={50}>
						<b className='icon-heart' />
					</C>
					<C ref='love_node' beta={50}>
						<b className='icon-pause' />
					</C>

					{this.share_render()}
				</C>
			</div>
		)
	}
});

module.exports = connect(function(state){
	return {
		saving_piece: state.saving_piece
	}
})(Widget)

