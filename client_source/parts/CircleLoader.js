var React = require('react');
var isEqual = require('lodash/lang/isEqual');

module.exports = React.createClass({

	stage: {},
	getDefaultProps: function(){
		return {
			angle: 0,
			radius: 0,
			angle_end: 0,
			angle_start: 0,
			width: 4,
			color: '#00BCFA',
			c_r: 255,
			c_g: 255,
			c_b: 255,
		}
	},

	getInitialState: function(){
		return {
			color: this.props.color,
			radius: this.props.radius,
			angle_start: this.props.angle_start,
			angle_end: this.props.angle_end,
			width: this.props.width,
			d: 0,
			c_r: this.props.c_r,
			c_g:this.props.c_g,
			c_b:this.props.c_b,
		}
	},

	getCenter: function(){
		this.centerX = this.refs.canvas.clientWidth / 2;
		this.centerY = this.refs.canvas.clientHeight / 2;
	},

	updateDims: function(){
		this.refs.canvas.width = this.refs.canvas.parentElement.clientWidth;
		this.refs.canvas.height = this.refs.canvas.parentElement.clientHeight;
	},

	componentDidUpdate: function(){
		this.updateDims();
		this.getCenter();
		this.toState();
	},

	shouldComponentUpdate: function(props,state){
		if(isEqual(state,this.state)) return false;
		return true
	},

	toState: function(d){
		//console.log("STAGE TO STATE",this.stage,this.state);
		TweenLite.to(this.stage,this.state.d || 0.5,Object.assign({
			c_r:this.state.c_r,
			c_g:this.state.c_g,
			c_b:this.state.c_b,
			radius: this.state.radius,
			angle_start: this.state.angle_start,
			angle_end: this.state.angle_end,
			width: this.state.width
		},{
			ease: Power4.easeOut,
			onUpdate: function(){
				this.draw();
			}.bind(this)
		}));
	},

	setStage: function(){
		Object.assign(this.stage,this.state);
	},

	draw: function(){
		this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
		this.ctx.beginPath();
		this.ctx.arc(this.centerX,this.centerY,this.stage.radius,this.stage.angle_start,this.stage.angle_end);
      	//this.ctx.lineWidth = this.stage.width;
      	//this.ctx.lineCap = 'round';
      	this.ctx.fillStyle = 'rgb('+Math.floor(this.stage.c_r)+','+Math.floor(this.stage.c_g)+','+Math.floor(this.stage.c_b)+')';
      	this.ctx.fill();
	},

	componentDidMount: function(){
		this.ctx = this.refs.canvas.getContext('2d');
		window.ctx = this.ctx;
		this.setStage();
		this.draw();
	},

	render: function(){
		return (
			<canvas className={this.props.className} ref="canvas" />
		)
	}
})