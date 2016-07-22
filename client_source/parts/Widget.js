var s = require('../state');







function rgba(r,g,b,a){
	return 'rgba('+Math.abs(Math.floor(r))+','+Math.abs(Math.floor(g))+','+Math.abs(Math.floor(b))+','+(a != null ? a : 1)+')'
}

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
		c_radius : 3,
		filler_radius: 15
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
		min_val: -5.5,
		max_val: 5.5,
		cycles_per_unit: 0.25,
		padding: 60,
		client_max_radius: 999, 
		client_min_radius: 50, 
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
		filler_radius: 0,
		color:  'rgba(255, 255, 255, 0.9)'
	}
	var tween = null

	function clipClientXY(x,y){
		var d = dist(x,y,stage.c_x,stage.c_y);
		stage.client_x = x
		stage.client_y = y
		if(d > (stage.client_max_radius || stage.diam/2) ){
			
			var xy = pointOnLine(x,y,stage.c_x,stage.c_y,stage.client_max_radius || stage.diam/2)
			stage.client_x = xy[0]
			stage.client_y = xy[1]

			
		}else if (d < stage.client_min_radius){
			var xy = pointOnLine(x,y,stage.c_x,stage.c_y,stage.client_min_radius)
			
				stage.client_x = xy[0]
				stage.client_y = xy[1]
		
			
		}
		
	}

	function drawVal(a){
		if(!stage.active) return

		ctx.font = "13px Arial"
		ctx.fillStyle = stage.color
		ctx.fillText( Math.round(stage.val * 1000)/1000 , stage.c_x+20, stage.c_y-20)
	}

	

	function mouseMove(e){
		if(!stage.active) return
	
		clipClientXY(e.clientX-50,e.clientY)

	}


	function drawCircle(x,y,r,c){
		ctx.beginPath();
		ctx.arc(x,y,r,0,Math.PI*2);
		ctx.fillStyle = c || stage.color
		ctx.fill();
	}

	function drawLine(){
		ctx.beginPath();
		ctx.moveTo(stage.c_x,stage.c_y)
		ctx.lineTo(stage.client_x,stage.client_y)
		ctx.strokeStyle = 'rgba(255,255,255,0.2)'
		ctx.stroke()
		ctx.closePath();
		// ctx.moveTo(stage.client_x,stage.client_y)
		// ctx.lineTo(stage.from_x,stage.from_y)
		// ctx.strokeStyle = 'rgba(255,255,255,0.1)'
		// ctx.stroke()
		// ctx.closePath();
	}

	function checkDrawCycle(){
		

		if(stage.prev_angle == null) return
		var a1 = (  stage.prev_angle + stage.offset_angle ) % (Math.PI*2)
		var a2 = (  stage.angle + stage.offset_angle ) % (Math.PI*2)
		var aa = null

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
			return 
		}else if(a1 < Math.PI/2 && a2 > Math.PI){
			stage.draw_cycles -= 1
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

	function getTotalAngle(a){
		return  (a || stage.c_a) + stage.cycles*Math.PI*2
	}

	function getClientAngle(){
		return (-Math.atan2(stage.client_y-stage.c_y,stage.c_x-stage.client_x) + Math.PI)
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
		
		drawCircle(stage.c_x,stage.c_y,stage.c_radius/2); 
		drawCircle(stage.client_x,stage.client_y,stage.c_radius*3,'rgba(0,0,0,0.5)');
		drawCircle(stage.client_x,stage.client_y,stage.c_radius*1.5);
		
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


	function start(index,e,value,bounds,color){
		
		
		if(stage.active == true) return false
		else stage.active = true //only after this.

		stage.overflow_cycles = 0;
		stage.cycles = 0;
		stage.prev_angle = null;
		stage.prev_a = null;
		stage.min_val = bounds[0];
		stage.max_val = bounds[1];
		stage.color = color


		stage.draw_cycles = Math.floor(value*stage.cycles_per_unit)
	
		
		
		param_index = index
		document.body.style.cursor = 'none'
		
		stage.c_x = c.width/2
		stage.c_y = c.height/2
		
		
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
		s.setParams();
		s.clearCurrentPiece();
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

var UserWidget = React.createClass({

	getInitialState: function(){
		return{
			is_new: false,
			show: false,
			active_knob: -1,
		}
	},

	componentDidMount: function(){
		window.widget = this;
		this.dragger = new Dragger(this.refs.canvas);
	},

	setDragger: function(i,e){
		var pos = this.refs.root.getBoundingClientRect();
		// this.dragger.stage.from_x = pos.left+pos.width/2 - 50
		// this.dragger.stage.from_y = pos.top+pos.height/2
		this.dragger.start(i,e.nativeEvent,this.props.params[i],this.props.current_type.bounds[i],rgba(255,255,255));
		document.addEventListener('click',this.endDragger,false)
		s.disable_autoplay();
		s.toggleRender(true);
		this.setState({
			active_knob: i,
		})

		e.preventDefault();		
	},

	endDragger: function(e){
		//console.log("END")
		s.toggleRender(false)
		document.removeEventListener('click',this.endDragger)
		this.dragger.end();
		this.setState({
			active_knob: -1,
		})
		e.preventDefault();
	},


	componentDidUpdate: function(props,state){
		this.syncCanvasDragger();
	},

	syncCanvasDragger: function(){
		var canvas_pos = this.refs.canvas.getBoundingClientRect();
		this.refs.canvas.width = this.refs['root'].clientWidth;
		this.refs.canvas.height = this.refs['root'].clientHeight;
		this.dragger.stage['vertical'] = this.refs.canvas.height > this.refs.canvas.width ? true : false
		this.dragger.stage['left'] = canvas_pos.left
		this.dragger.stage['top'] = canvas_pos.top
	},

	save: function(){
		s.saveCurrentPiece(function(){
			this.setState({
				saving: false
			})			
		}.bind(this))
		this.setState({
			saving: true
		})
	},
	reset: function(){
		s.showType(this.props.current_type);
	},
	like: function(){
		s.setLike(this.props.current_piece);
	},
	show: function(){
		this.setState({
			show: !this.state.show
		})
	},

	getAngle: function(angle,dist,radius,scale){
		if(scale == null) scale = 1;
		var off = -Math.PI;
		var x = Math.cos(angle+off)*dist
		var y = Math.sin(angle+off)*dist
		if(!this.state.show){
			return {
				transform: 'translate('+radius*-1+'px,'+radius*-1+'px) scale('+(scale)+')'
			}
		}
		return {
			transform: 'translate('+(x-radius)+'px,'+(y-radius)+'px) scale('+(scale)+')'
		}
	},

	render: function(){

		var liked = false
		if(this.props.current_piece){
			liked = this.props.liked_pieces.indexOf(this.props.current_piece.id) != -1;
		}



		var save_class = 'circle widget-save ' + (this.props.current_piece ? 'widget-save-hide' : '');
		var reset_class = 'circle widget-reset ' + (!this.props.current_piece ? 'widget-reset-hide' : '');
		var like_class = 'circle widget-like ' + (this.props.current_piece ? 'widget-like-hide':'') + (liked ? ' widget-like-active':'');
		var root_class = 'circle widget-root ' + (this.state.show ? 'widget-root-hide' :''); 

		var save_scale = ( (this.state.saving || this.props.current_piece) ? 0 : 1)
		var like_scale = (this.props.current_piece ? 1 : 0)
		var root_scale = (!this.state.show ? 1 : 0.75);
		var reset_scale = 1;
		
		var def = true
		for(var i = 0;i<this.props.params.length;i++){
			if(this.props.current_type){
				if(this.props.params[i] != this.props.current_type.params[i]) def = false
			}
		}

		if(def) reset_scale = save_scale = 0;
		

		var params = []	
		var d = 0.6;
		var l1 = 65;
		var l2 = 120;
		var save = <div onClick = {this.save} className = {save_class} style = {this.getAngle(Math.PI/2+d,l1,20,save_scale)}><b className = 'icon-database'/></div>
		var reset = <div onClick = {this.reset} className = {reset_class} style = {this.getAngle(Math.PI/2-d,l1,20,reset_scale)}><b className = 'icon-ccw'/></div>
		var like = <div onClick = {liked ? null : this.like} className = {like_class} style = {this.getAngle(Math.PI/2+d,l1,20,like_scale)}><b className = 'icon-heart'/></div>
		var root = <div onClick = {this.show} className = {root_class} style = {this.getAngle(0,0,75/2,root_scale)}><b className='icon-cog' /></div>

		var params = this.props.params.map(function(param,i){
			var d2 = 0.5
			var a = Math.PI/2-(d2*Math.floor(this.props.params.length/2))+(d2*i)
			
			var scale = 0
			if(this.state.active_knob == -1) scale = 1;

			return <div key = {'widget_param_'+i}className = {'circle widget-param'} style = {this.getAngle(a,l2,15,scale)} onClick = {this.setDragger.bind(this,i)} />
		}.bind(this))

		
		return (
			<div className = 'user-widget'  ref = "root">
				<canvas  tabIndex='1' ref='canvas' className = 'user-widget-canvas' />
				<div className = 'user-widget-filter'>
					<div className = 'user-widget-container'>
						{reset}
						{save}
						{like}
						{params}
						{root}
					</div>
				</div>
			</div>
		)
	}
});

module.exports = UserWidget
