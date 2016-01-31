//parameters
var C = require('circui').Circle;
var React = require('react');
var connect = require('react-redux').connect;
var CircleMixin = require('circui').Mixin;

var s = require('../store')


function clamp(x,a,b){
	if(x<a) return a
	if(x>b) return b
	return x
}

function dist(x1,y1,x2,y2){
	var d = Math.sqrt((x2-x1)*(x2-x1) + (y2 - y1)*(y2 - y1)) 
	return d
}

function pointOnLine(x2,y2,x1,y1,n){
	
	var d = Math.sqrt((x2-x1)*(x2-x1) + (y2 - y1)*(y2 - y1)) 
	var r = n / d 

	var x3 = r * x2 + (1 - r) * x1 
	var y3 = r * y2 + (1 - r) * y1 

	return [x3,y3]
}



var	Dragger = function(canvas){
	var c = canvas;
	var ctx = canvas.getContext("2d");
	var vertical = false

	var defaults = {
		c_radius : 2,
		filler_radius: 20
	}

	var stage = {
		from_x: c.height/2,
		from_y: c.width/2,
		active: false,
		val: 0,
		angle: 0,
		prev_a: 0,
		min_val: -1.5,
		max_val: 5.5,
		cycles_per_unit: 1,
		padding: 60,
		client_max_radius: 100, 
		client_min_radius: defaults.filler_radius, 
		vertical: false,
		c_radius : 0,
		c_y: c.height/2,
		c_x: c.width/2,
		client_x: c.height/2,
		client_y: c.width/2,
		diam: c.width,
		cycles: 0,
		filler_radius: 0
	}

	function clipClientXY(x,y){


		var d = dist(x,y,stage.c_x,stage.c_y);


		if(d > (stage.client_max_radius || stage.diam/2) ){
			var xy = pointOnLine(x,y,stage.c_x,stage.c_y,stage.client_max_radius || stage.diam/2)
			x = xy[0]
			y = xy[1]
		}else if (d < stage.client_min_radius){
			var xy = pointOnLine(x,y,stage.c_x,stage.c_y,stage.client_min_radius)
			x = xy[0]
			y = xy[1]			
		}

		return [x,y]
	}

	function drawVal(a){
		if(!stage.active) return

		ctx.font = "13px Arial"
		
		ctx.fillStyle = "rgba(255,255,255,0.6)"
		
		
		ctx.fillText( Math.round(stage.val * 1000)/1000 , stage.c_x+20, stage.c_y-20)
	}

	

	function mouseMove(e){
		if(!stage.active) return
	
		var clip = clipClientXY(e.clientX-stage.left,e.clientY-stage.top)

		stage.client_x = clip[0]
		stage.client_y = clip[1]
	}


	function drawCircle(x,y){
		ctx.beginPath();
		ctx.arc(x,y,stage.c_radius,0,Math.PI*2);
		ctx.fillStyle = 'rgba(255, 255, 255, 1)'
		ctx.fill();
	}

	function drawLine(){
		ctx.beginPath();
		ctx.moveTo(stage.c_x,stage.c_y)
		ctx.lineTo(stage.client_x,stage.client_y)
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
		ctx.stroke()
		ctx.closePath();
		ctx.moveTo(stage.client_x,stage.client_y)
		ctx.lineTo(stage.from_x,stage.from_y)
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
		ctx.stroke()
		ctx.closePath();
	}

	function checkCycle(){
		if(stage.prev_a > Math.PI && stage.angle < Math.PI/2){
			
			stage.cycles += 1
			return true
		}else if(stage.prev_a < Math.PI/2 && stage.angle > Math.PI){
		
			stage.cycles -= 1
			return false
		}
		
	}

	function getVal(){
		stage.val = ( stage.cycles < 0 ? stage.cycles + 1 : stage.cycles ) * stage.cycles_per_unit
		stage.val += stage.cycles < 0 ? -1 * stage.cycles_per_unit/(Math.PI*2)*(Math.PI*2-stage.angle) :  stage.cycles_per_unit/(Math.PI*2)*(stage.angle)
		//stage.val = clamp(stage.val,stage.min_val,stage.max_val)
	}

	function getAngle(val){
		if(val < 0){
			return (Math.PI*2 - (Math.PI*2) / stage.cycles_per_unit * val ) % (Math.PI*2)
		}else{
			return ((Math.PI*2) / stage.cycles_per_unit * val ) % (Math.PI*2)
		}
		
	}


	function drawFiller(){

		
		

		


		if(stage.cycles < 0){
			fillstyle = 'rgba(0, 0, 0, 0.1)'
		}else{
			fillstyle = 'rgba(255, 255, 255, 0.1)'
		}



		for(var i = (stage.cycles < 0 ? stage.cycles+1 : 0) ;i < (stage.cycles < 0 ? 0 : stage.cycles) ;i++){
			ctx.beginPath();
			ctx.arc(stage.c_x, stage.c_y,stage.filler_radius,0, Math.PI*2,false);
			ctx.lineTo(stage.c_x, stage.c_y);
			ctx.closePath();
			ctx.fillStyle = fillstyle
			ctx.fill();	
		}
		
		ctx.beginPath();
		ctx.arc(stage.c_x, stage.c_y,stage.filler_radius, stage.cycles < 0 ? stage.angle : 0, stage.cycles < 0 ? 0 : stage.angle ,false);
		ctx.lineTo(stage.c_x, stage.c_y);
		ctx.closePath();
		ctx.fillStyle = fillstyle
		ctx.fill();

	}

	function render(){
		ctx.clearRect(0,0,c.width,c.height); //always clear before render.

		//set stage center x and y
		stage.c_x = c.width/2
		stage.c_y = c.height/2

		stage.max_angle = 
		stage.min_angle = 

		//set angle
		stage.angle = (-Math.atan2(stage.client_y-stage.c_y,stage.c_x-stage.client_x) + Math.PI) % (Math.PI*2) 
		

		//set diameter 
		stage.diam = stage.vertical ? c.width-stage.padding*2 : c.height-stage.padding*2

		checkCycle()
		/*calc val*/
		getVal()

		

		if(stage.val <= stage.min_val){
			
			stage.angle = getAngle(stage.min_val)
			getVal()
		}else if(stage.val >= stage.max_val){
			
			stage.angle = getAngle(stage.max_val)
			getVal()			
		}

		

		

		drawFiller();
		drawCircle(stage.c_x,stage.c_y); 
		drawCircle(stage.client_x,stage.client_y);
		
		drawLine(); 
		drawVal();


		


		//set prev angle
		 stage.prev_a = stage.angle;

		if(stage.active) s.setParam(param_index,stage.val);
	}




	function hideAll(cb){
		stage.from_x = stage.c_x
		stage.from_y = stage.c_y
		stage.client_x = stage.c_x
		stage.client_y = stage.c_y
		TweenLite.to(stage,0.2,{
			c_radius: 0,
			filler_radius: 0,
			onComplete: function(){
				ctx.clearRect(0,0,c.width,c.height);
				cb()
			}
			
			// ease: Power3.easeIn,
		})
		// TweenLite.to(stage,0.4,{

		// 	ease: Power3.easeOut,
		// })
		
		stage.active = false
	}

	function showAll(){
		stage.active = true
		stage.client_x = stage.c_x
		stage.client_y = stage.c_y

		TweenLite.to(stage,1,{
			filler_radius: defaults.filler_radius,
			c_radius: defaults.c_radius,
			ease: Elastic.easeOut,
		})
	}


	var render_index = -1
	var listener = listener2 = null
	var save_interval
	var param_index
	function start(index){
		param_index = index
		c.style.cursor = 'none'
		
		listener = document.addEventListener('mousemove',mouseMove)
		//listener2 = document.addEventListener('mouseup',end)
	
		if(stage.active) return false
		else{
				
			render_index = s.loops.length
			TweenLite.ticker.addEventListener("tick",render);
			showAll();
		}
	}

	function end(){

		document.body.style.cursor = 'initial'
		document.removeEventListener(listener)
		//document.removeEventListener(listener2)
		s.saveParams();
		hideAll(function(){
			TweenLite.ticker.removeEventListener("tick",render);
		});
	}

	



	

	return {
		start: start,
		end: end,
		stage: stage
	}
}

































var Knob = React.createClass({
	mixins: [CircleMixin],

	// shouldComponentUpdate: function(props,state){
		
	// 	return true
	// },

	params: {length:3},

	getInitialState: function(){
		return {
			expanded: false,
			selected_option: -1
		}
	},



	getDefaultProps: function(){
		return {
			hide: false,
			beta: 60,
			size: 30,
			index: 0,
			active_knob: -1
		}
	},

	shouldComponentUpdate: function(props){
		// if(this.props.active_knob != props.active_knob){
		// 	if(this.props.active_knob == this.props.index){
		// 		this.setState({
		// 			expanded: true
		// 		})
		// 	}else{
		// 		this.setState({
		// 			expanded: false
		// 		})
		// 	}
		// }
		this.param = s.store.getState().app.piece_params[this.props.index]
		return true
	},
	
	setReset: function(){
		this.setState({
			selected_option: 1
		})
	},

	setEdit: function(){
		this.setState({
			selected_option: 2
		})
		this.start();
	},

	setRoot: function(){
		if(this.state.selected_option != -1){
			this.end();
		}

	},

	setRandom: function(){
		this.setState({
			selected_option: 3
		})
	},

	initDrag: function(){

	},

	start: function(){

		setTimeout(function() {
			var pos = this.refs.knob_edit.refs.root.getBoundingClientRect();
			dragger.stage.from_x = pos.left - dragger.stage.left + pos.width/2
			dragger.stage.from_y = pos.top - dragger.stage.top + pos.height/2
		}.bind(this), 100);

		var pos = this.refs.knob_edit.refs.root.getBoundingClientRect();
		dragger.stage.from_x = pos.left - dragger.stage.left + pos.width/2
		dragger.stage.from_y = pos.top - dragger.stage.top + pos.height/2
		dragger.start(this.props.index);
		this.startListener = document.addEventListener('mouseup',this.end)

	},

	end: function(){
		document.removeEventListener(this.startListener)
		dragger.end();
		this.setState({
			//expanded: false,
			selected_option: -1
		})
	},



	render: function(){	
			
		if(this.params.length >= this.props.index){
			if(this.props.active_knob != -1 && this.props.active_knob != this.props.index){
				var scale = 0
			}else{
				var scale = 1
			}

		}else{
			var scale = 0
		}

		
		var val = Math.round(this.param*100)/100
		

		var expanded = this.props.active_knob == this.props.index

		

		//console.log(beta,this.props.active_knob)
		return (


			<C {...this.props }   expanded = {expanded} scale = {scale} distance={1.5}  ref={'root'} onMouseEnter={this.setRoot} className='knob-root'>
				<b>{val}</b>
				<C abs_angle = {true} offset_angle={Math.PI/2} id='reset' className='knob-reset' ref='knob_reset' scale={this.state.selected_option != 1 && this.state.selected_option != -1 ? 0 : (this.state.selected_option==1 ? 0.7 : 1) } onMouseEnter={this.setReset} distance={1} beta={110} size={30}>
					<b className='icon-cancel' ></b>
				</C>	
				<C abs_angle = {true} offset_angle={Math.PI/2} id='edit' className='knob-edit' ref='knob_edit' scale = {this.state.selected_option != 2 && this.state.selected_option != -1 ? 0 : (this.state.selected_option==2 ? 0.7 : 1)} onMouseEnter={this.setEdit} distance={1}  beta={110} size={30}>
					<b className='icon-sliders' ></b>
				</C>
				<C abs_angle = {true} offset_angle={Math.PI/2} id='rand' className='knob-random' ref='knob_random'  scale={this.state.selected_option != 3 && this.state.selected_option != -1 ? 0 : (this.state.selected_option==3 ? 0.7 : 1) } onMouseEnter={this.setRandom} distance={1} beta={110} size={30}>
					<b className='icon-sun' ></b>
				</C>	
			</C>
		)

	}
})

// var CKnob = connect(function(state){
// 	return {
// 		params: state.app.piece_params
// 	}
// })(Knob)



var dragger = null



var ParamWidget = React.createClass({

	getInitialState: function(){
		return {
			expanded: false,
			active_knob: -1
		}
	},

	toggleRoot: function(){
		this.setState({
			expanded: !this.state.expanded
		})
	},

	componentDidMount: function(){
		window.root = this
		window.test = this.refs['test']
		dragger = new Dragger(this.refs.canvas)
		window.dragger = dragger

		document.addEventListener('mouseup',this.clearknobAction)
		console.log(dragger)
	},

	clearknobAction: function(){
		if(this.state != -1){
			this.setState({
				active_knob: -1,
			})
		}
	},

	knobAction:  function(i,e){
		// var knob = this.refs['knob_'+i]
	
		// document.body.style.cursor = 'none'
		// var pos = knob.refs.root.getBoundingClientRect();
		// this.dragger.stage.from_x = pos.left - this.dragger.stage.left + pos.width/2
		// this.dragger.stage.from_y = pos.top - this.dragger.stage.top + pos.height/2
		// this.dragger.start();

		
		// else if(this.state.active_knob == -1) document.removeEventListener(this.listener)
		
		e.preventDefault()
		this.setState({
			active_knob: i,
		})



	},


	componentDidUpdate: function(){

		var canvas_pos = this.refs.canvas.getBoundingClientRect();
		this.refs.canvas.width = this.refs.root.clientWidth;
		this.refs.canvas.height = this.refs.root.clientHeight;
		dragger.stage['vertical'] = this.refs.canvas.height > this.refs.canvas.width ? true : false
		dragger.stage['left'] = canvas_pos.left
		dragger.stage['top'] = canvas_pos.top
	},

	render: function(){

		//console.log(this.state.active_knob == 1)
		return (
			<div ref = 'root' className = 'param-widget'>
				<div className = 'param-widget-select'>
					<C className = 'param-root' ref = 'root_c' padding = {-5} size={60} angle = {Math.PI/2} expanded={this.state.expanded} onClick={this.toggleRoot}>
						<b className='icon-sliders' />
						<Knob onMouseDown={this.knobAction.bind(this,5)} ref = 'knob_5'  active_knob = {this.state.active_knob} index={5} />
						<Knob onMouseDown={this.knobAction.bind(this,3)} ref = 'knob_3'  active_knob = {this.state.active_knob} index={3} />
						<Knob onMouseDown={this.knobAction.bind(this,1)} ref = 'knob_1' active_knob = {this.state.active_knob} index={1} />
						<Knob onMouseDown={this.knobAction.bind(this,2)} ref = 'knob_2' active_knob = {this.state.active_knob} index={2} />
						<Knob onMouseDown={this.knobAction.bind(this,4)} ref = 'knob_4' active_knob = {this.state.active_knob} index={4} />
					</C>
				</div>
				<canvas  tabIndex='1' ref='canvas' className = 'param-widget-canvas'>
					canvas not supporte
				</canvas>
			</div>
			
		)
	}
})

module.exports = ParamWidget;