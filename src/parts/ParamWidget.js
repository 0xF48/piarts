//parameters
var C = require('circui').Circle;
var React = require('react');
var connect = require('react-redux').connect;
var CircleMixin = require('circui').Mixin;

var s = require('../store')

function normalize(a){
	if(a < 0){
		return Math.PI*2+a
	}else return a
}

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
		offset_angle: 0,
		from_x: c.height/2,
		from_y: c.width/2,
		active: false,
		val: 0,
		angle: 0,
		prev_a: null,
		prev_angle: null,
		min_val: -1.5,
		max_val: 1.5,
		cycles_per_unit: 1,
		padding: 60,
		client_max_radius: 999, 
		client_min_radius: defaults.filler_radius, 
		vertical: false,
		c_radius : 0,
		c_a : 0,
		c_y: c.height/2,
		c_x: c.width/2,
		client_x: c.height/2,
		client_y: c.width/2,
		diam: c.width,
		cycles: 0,
		draw_cycles: 0,
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


	function drawCircle(x,y,r){
		ctx.beginPath();
		ctx.arc(x,y,r,0,Math.PI*2);
		ctx.fillStyle = 'rgba(255, 255, 255, 1)'
		ctx.fill();
	}

	function drawLine(){
		ctx.beginPath();
		ctx.moveTo(stage.c_x,stage.c_y)
		ctx.lineTo(stage.client_x,stage.client_y)
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
		ctx.stroke()
		ctx.closePath();
		ctx.moveTo(stage.client_x,stage.client_y)
		ctx.lineTo(stage.from_x,stage.from_y)
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
		ctx.stroke()
		ctx.closePath();
	}

	function checkDrawCycle(){
		

		if(stage.prev_angle == null) return
		var a1 = (  stage.prev_angle + stage.offset_angle ) % (Math.PI*2)
		var a2 = (  stage.angle + stage.offset_angle ) % (Math.PI*2)
		var aa = null

		//console.log('ang',stage.angle,'off',stage.offset_angle,'a2',a2,'c',stage.draw_cycles)

		if(a2 > 0 && a1 < 0){
			stage.draw_cycles += 1
			return 
		}else if(a2 < 0 && a1 > 0){
			stage.draw_cycles -= 1
			return 
		}

		if(stage.draw_cycles < 0){
			a1 = Math.abs(a1)
			a2 = Math.abs(a2)
			aa = a2
			a2 = a1
			a1 = aa
			aa = null
		}
		
		if(a1 > Math.PI && a2 < Math.PI/2 ){
			stage.draw_cycles += 1
			//console.log("ADD DRAW CYCLE",stage.draw_cycles)
			
			return 
		}else if(a1 < Math.PI/2 && a2 > Math.PI){
			stage.draw_cycles -= 1
			//console.log("REMOVE DRAW CYCLE",stage.draw_cycles)

			return 
		}
	}

	function checkCycle(){
		//console.log("CYCLE", stage.prev_a,stage.angle)
		if(stage.prev_a == null) return

		
		

		if(stage.prev_a > Math.PI && stage.c_a  < Math.PI/2){
			//console.log("ADD CYCLE")
			if(stage.val >= stage.max_val){
				stage.overflow_cycles += 1
				stage.cycles += 1
			}else if(stage.val <= stage.min_val){
				stage.cycles += stage.overflow_cycles
				stage.overflow_cycles = 0
			}else{
				stage.cycles += 1
			}
			
			
			
			
			return true
		}else if(stage.prev_a < Math.PI/2 && stage.c_a > Math.PI){

			//console.log("REMOVE CYCLE")
			if(stage.val >= stage.max_val){
				//stage.cycles -= 1
				stage.cycles -= stage.overflow_cycles
				stage.overflow_cycles = 0
			}else if(stage.val <= stage.min_val){
				stage.overflow_cycles += 1			
				stage.cycles -= 1
			}else{
				stage.cycles -= 1
			}


			return false
		}
	}



	function getAngle(val){
		return val * (Math.PI*2)/stage.cycles_per_unit 
	}

	function getVal(a){
		return stage.cycles_per_unit/(Math.PI*2)*(a)
	}




	function drawFiller(){
		var start_a = 0;
		var end_a = 0;
	
		if(stage.draw_cycles < 0){
			fillstyle = 'rgba(0, 0, 0, 0.1)'
		}else{
			fillstyle = 'rgba(255, 255, 255, 0.1)'
		}

		for(var i = (stage.draw_cycles < 0 ? stage.draw_cycles+1 : 0) ;i < (stage.draw_cycles < 0 ? 0 : stage.draw_cycles) ;i++){
			ctx.beginPath();
			ctx.arc(stage.c_x, stage.c_y,stage.filler_radius,stage.offset_angle, Math.PI*2+stage.offset_angle,false);
			ctx.lineTo(stage.c_x, stage.c_y);
			ctx.closePath();
			ctx.fillStyle = fillstyle
			ctx.fill();	
		}

		if(stage.draw_cycles < 0){
			end_a = normalize(-stage.offset_angle % (Math.PI*2))
			start_a = normalize(stage.angle % (Math.PI*2))
		}else{
			start_a = normalize(-stage.offset_angle % (Math.PI*2))
			end_a = normalize(stage.angle % (Math.PI*2))
		}
		
		ctx.beginPath();
		ctx.arc(stage.c_x, stage.c_y,stage.filler_radius, start_a, end_a ,false);
		ctx.lineTo(stage.c_x, stage.c_y);
		ctx.closePath();
		ctx.fillStyle = fillstyle
		ctx.fill();
	}

	function getTotalAngle(a){
		return  (a || stage.c_a) + stage.cycles*Math.PI*2
	}

	function getClientAngle(){
		return (-Math.atan2(stage.client_y-stage.c_y,stage.c_x-stage.client_x) + Math.PI)
		
		// if(stage.cycles < 0){
		// 	return (-Math.atan2(stage.client_y-stage.c_y,stage.c_x-stage.client_x) + Math.PI) + (stage.cycles-1*Math.PI*2)
		// }else{
			
		// }
	}


	function setOffset(value){
		stage.offset_value_angle = getAngle(value)
		stage.offset_client_angle = getClientAngle()
		stage.offset_angle = (stage.offset_value_angle - stage.offset_client_angle)
	}

	function render(){
		//console.log('test')
	
		ctx.clearRect(0,0,c.width,c.height); //always clear before render.

		//movement confinements
		stage.diam = stage.vertical ? c.width-stage.padding*2 : c.height-stage.padding*2
		stage.client_max_radius = stage.diam/2

		//set stage center x and y and angle
		stage.c_x = c.width/2
		stage.c_y = c.height/2
		stage.c_a = getClientAngle()
		checkCycle() //check c_a cycle

		stage.angle = getTotalAngle()
		
		var val  = getVal(stage.angle + stage.offset_angle)

		/* over max or under min */
		if(val <= stage.min_val){
			stage.angle = getAngle(stage.min_val) - stage.offset_angle
			stage.val = stage.min_val
		}else if(val >= stage.max_val){
			stage.angle = getAngle(stage.max_val) - stage.offset_angle
			stage.val = stage.max_val
		}else{
			stage.val = val
		}

		/* check draw cycles */
		checkDrawCycle()

		/* draw */
		drawFiller();
		drawCircle(stage.c_x,stage.c_y,stage.c_radius); 
		drawCircle(stage.client_x,stage.client_y,stage.c_radius*2);
		drawLine(); 
		drawVal();

		/* set param */
		if(stage.active) s.setParam(param_index,stage.val);

		/*remmember previous angle*/
		stage.prev_a = stage.c_a
		stage.prev_angle = stage.angle
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

		
		stage.active = false
	}

	function showAll(){
		stage.active = true
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


	function start(index,e,value){
		console.log("START",stage)
		if(stage.active == true) return false
		else stage.active = true //only after this.

		stage.overflow_cycles = 0;
		stage.cycles = 0;
		stage.prev_angle = null;
		stage.prev_a = null
		if(value < 0){
			stage.draw_cycles = -1 * ( Math.floor(value*stage.cycles_per_unit) + 1 )
		}else{
			stage.draw_cycles = Math.floor(value*stage.cycles_per_unit)
		}
		
		param_index = index
		document.body.style.cursor = 'none'
		
		document.addEventListener('mousemove',mouseMove)
		
		mouseMove(e);
		setOffset(value);
		render_index = s.loops.length
		TweenLite.ticker.addEventListener("tick",render);
		showAll();
		
	}

	function end(){
		stage.active = false
		document.body.style.cursor = 'initial'
		document.removeEventListener('mousemove',mouseMove)
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







var ParamWidget = React.createClass({

	mixins: [CircleMixin],
	
	getInitialState: function(){
		return {
			expanded: false,
			active_knob: -1,
			padding: 10
		}
	},

	initDragger: function(canvas){
		this.dragger = new Dragger(canvas);
		window.dragger = this.dragger
	},

	setDragger: function(i,e){
		console.log("START")
		var pos = this.refs.root.refs.root.getBoundingClientRect();
		this.dragger.stage.from_x = pos.left - this.dragger.stage.left + pos.width/2
		this.dragger.stage.from_y = pos.top - this.dragger.stage.top + pos.height/2
		this.dragger.start(i,e.nativeEvent,this.props.params[i]);
		document.addEventListener('mousedown',this.endDragger,false)

		this.setState({
			active_knob: i,
		})

		e.preventDefault();
	},

	endDragger: function(){
		console.log("END")
		document.removeEventListener('mousedown',this.endDragger)
		this.dragger.end();
		this.setState({
			active_knob: -1,
		})
	},

	dragger: null,

	getScale: function(index){
		if(this.props.params[index] == null) return 0
		if(this.state.active_knob == index) return 0
		if(this.state.active_knob != index && this.state.active_knob != -1){
			return 0.45
		}else{
			return 1
		}
	},

	getDist: function(index){
		if(this.props.params[index] == null) return -0.5
		if(this.state.active_knob == index) return 2.5
		if(this.state.active_knob != -1){
			return -0.5
		}else{
			return 2.5
		}
	},

	getVal: function(index){
		if(this.props.params[index] == null || this.props.params[index] == NaN) return null
		else return Math.round(this.props.params[index]*100)/100
	},

	componentDidMount: function(){
		window.param_widget = this;
	},

	render: function(){
		var c_size = 35;
		var c_beta = 20;
		var c_style = {display: this.state.active_knob != -1 ? 'none' : 'initial'}

		return (
			<C {...this.props} rootClass = 'param-widget' ref = 'root' padding = {this.state.padding} size={40} angle = {Math.PI/2} expanded={this.props.expanded}>
				<b className='icon-sliders' />
				<C beta = {c_beta} size={c_size} distance={this.getDist(4)} onMouseDown={this.setDragger.bind(this,4)} ref = 'knob_4' scale = {this.getScale(4)}>
					<b style={c_style}>{this.getVal(4)}</b></C>
				<C beta = {c_beta} size={c_size} distance={this.getDist(2)} onMouseDown={this.setDragger.bind(this,2)} ref = 'knob_2' scale = {this.getScale(2)}>
					<b style={c_style}>{this.getVal(2)}</b></C>
				<C beta = {c_beta} size={c_size} distance={this.getDist(0)} onMouseDown={this.setDragger.bind(this,0)} ref = 'knob_0' scale = {this.getScale(0)}>
					<b style={c_style}>{this.getVal(0)}</b></C>
				<C beta = {c_beta} size={c_size} distance={this.getDist(1)} onMouseDown={this.setDragger.bind(this,1)} ref = 'knob_1' scale = {this.getScale(1)}>
					<b style={c_style}>{this.getVal(1)}</b></C>
				<C beta = {c_beta} size={c_size} distance={this.getDist(3)} onMouseDown={this.setDragger.bind(this,3)} ref = 'knob_3' scale = {this.getScale(3)}>
					<b style={c_style}>{this.getVal(3)}</b></C>
			</C>
		)
	}
})



module.exports = ParamWidget;


