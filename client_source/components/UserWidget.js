var C = require('circui').Circle;
var I = require('intui').Slide;
var connect = require('react-redux').connect;
var CLoader = require('circui').Loader;
var s = require('../data/store.js');
var ParamWidget = require('./ParamWidget');
var CircleMixin = require('circui').Mixin;


var SaveWidget = React.createClass({

	mixins: [CircleMixin],

	getInitialState: function(){
		return {
			sharing: false
		}
	},

	componentWillReceiveProps: function(props){
		//console.log(this.props.saving_piece)
		//start save loader.
		if(!this.props.saving_piece && props.saving_piece){
			this.refs.loader.setState({
				ease:Power2.easeOut,
				c_r: 0,
				c_g: 235,
				c_b: 255,
				d: 4,
				angle_start:0,
				angle_end: Math.PI*1.5,
			})
			return true
		}

		//done save loader
		if(!props.saving_piece && this.props.saving_piece){
			this.refs.loader.setState({
				c_r: 0,
				c_g: 235,
				c_b: 255,
				d: 1,
				angle_start:0,
				angle_end: Math.PI*2,
			})
			return true
		}else if(!props.save_sharing && this.props.save_sharing){
			this.refs.loader.setState({
				c_r: 255,
				c_g: 255,
				c_b: 255,
				d: 0.5,
				angle_start:0,
				angle_end: 0,
			})
		}
		
	},

	// toggleShare: function(){
	// 	if(!this.state.sharing) return
	// 	this.setState({
	// 		sharing: false
	// 	})
	// },


	saveShare: function(){
		console.log("SAVE toggled")
		if(this.props.saving_piece) return
		if(this.props.save_sharing) {
			s.showPieceList('saved')
			this.end()
		}else{
			s.saveCurrentPiece()
		}
	},

	componentDidMount: function(){
		// console.log(this.refs['root'])
		// window.tt = this.refs['root']
	},


	//cancel and return to normal mode
	end: function(){
		s.toggleSaveShare(false)
	},


	//view the piece in the browser
	viewInBrowser: function(){
		s.showPieceList('saved')
		this.end()
	},



	render: function(){
		return (
			<C {...this.props} padding={0} className='share_node' ref='root' onClick={this.saveShare}>
				<div className='share-slide-container'>
					<CLoader ref = 'loader' className='loader' color='#2F8BAD' c_r={255} c_g={255} c_b={255} radius={70/4} width={3} />
					<I slide v beta={100} ref='slide' index_pos = {this.props.save_sharing ? 1 : 0} outerClassName='share_slide'>
						<I beta={100} innerClassName='share-slide-save'>
							<b className='icon-database' />
						</I>
						<I beta={100} innerClassName='share-slide-view'>
							<b className='icon-eye' />
						</I>	
					</I>
				</div>
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
		if(!this.props.current_type) return


		if(this.props.saving_piece) return
		if(this.props.save_sharing){
			s.toggleSaveShare(false)
		}

		
		this.setState({
			expanded: !this.state.expanded,
			params_expanded : !this.state.expanded
		})
	},

	startSave: function(){
		console.log('start save',this.props.saving_piece)
		if(this.props.saving_piece) return
		this.setState({
			params_expanded : false
		})
		this.refs['save_widget'].saveShare()
	},



	//decide whether to expand the params or not based on whether we are saving.
	paramState: function(){
		
		if(this.props.save_sharing == true) return false
		if(!this.state.expanded) return false
		return true
	},

	setLike: function(){
		console.log("set like")
		if(this.props.current_piece != null){
			s.setLike(this.props.current_piece)
		}
	},


	render: function(){
		var scale = 1;
		if(this.props.current_piece != null){
			if(this.props.liked_pieces.indexOf(this.props.current_piece.id) != -1){
				scale = 0.7
			}
		}else{
			scale = 0
		}
		
		return (
			<div className = 'user-widget' ref = 'root'  >
				<canvas  tabIndex='1' ref='canvas' className = 'user-widget-canvas' />
				<C padding = {6} rootStyle={{top:'50%'}} rootClass = 'user-widget-dom' ref='root_node' expanded={this.state.expanded} onClick={this.toggleRoot} size={85} angle = {-Math.PI/2} >
					<b className='icon-cog' />
					<C distance={1.2}  beta = {45} scale={scale} selfClass="love_node" ref='love_node' onClick={this.setLike}>
						<b className='icon-heart' style={{color: ((this.props.current_piece != null && this.props.liked_pieces.indexOf(this.props.current_piece.id) != -1) ? '#FF0072' : 'black')}}/>
					</C>
					<ParamWidget distance={1.3} beta={100} ref='param_widget' expanded={ this.paramState() } params={this.props.params} current_type = {this.props.current_type} save_sharing={this.props.save_sharing} />
					<SaveWidget distance={1.2} beta={45} ref='save_widget' saving_piece={this.props.saving_piece} save_sharing={this.props.save_sharing}/>

				</C>		
			</div>
		)
	}
});

module.exports = UserWidget
