var C = require('circui').Circle;
var I = require('intui').Slide;
var React = require('react');

var CLoader = require('circui').Loader;

var Widget = React.createClass({
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
		}
	},

	toggle: function(){
		this.setState({
			saved: !this.state.saved
		})
	},


	shouldComponentUpdate: function(props,state){
		if(state.saving != this.state.saving){
			if(state.saving == true){
				this.refs.share_startSave();
			}else{
				this.refs.share_endSave();
			}
			
		}
		if(state.sharing != this.state.sharing){

		}
	},

	componentWillUpdate: function(state){
		if(state.saving && !this.state.saving) this.refs.loader.to({
			start_angle:0,
			end_angle: Math.PI
		},1)

		if(!state.saving && this.state.saving){
			this.refs.loader.to({
				end_angle: Math.PI*2
			},0.3)
		}

		if(this.state.sharing != state.sharing){
			this.refs.slide.to({
				beta: state.sharing ? 100 : 0
			});
		}
	},

	componentDidMount: function(){
		window.node = this.refs.slide
		window.widget = this;
	},

	share_startSave: function(){

	},

	share_endSave: function(){

	},

	share: function(){
		if(this.state.sharing || this.state.saving){
			return this.setState({
				saving: false,
				sharing: false
			})
		}else{
			this.setState({
				saving: true,
			})

			setTimeout(function() {
				this.setState({
					saving: false,
					sharing: true
				})
			}.bind(this), 1000);			
		}
	},

	share_render: function(){
		return (
			<C padding={7} className='share_node' ref='share_node' beta={50} onClick={this.share}>
				<div className='share-slide-container'>
					<CLoader ref = 'loader' className='loader'/>
					<I relative slide beta={100} ref='slide'>
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

	render: function(){
		return (
			<div id = 'widget'>
				<C ref='root_node' size={100} angle = {-Math.PI/2} >
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

module.exports = Widget;