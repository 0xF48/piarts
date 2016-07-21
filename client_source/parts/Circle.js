//react circle class.
var _ = {
	isEqual :require('lodash/lang/isEqual'),
};
/*
1. circle can be added to a parent circle.
2. child circle can be places at specific angle index if angle index is free.
3. angle indecies are precaluclated based on each child radius.
4. child radius is set with beta variable relative to parent.
5. x/y coordinates are static and rerenderd on resize.
6. when child state is active, it will shrink in radius and animate out the children from the center.
*/
var React = require('react');
//first child passed to circle class is content of parent.
//everything else are children.
module.exports = React.createClass({

	styl: {
		root: {
			"pointerEvents": "none",
			"left"			: "0",
			"top"			: "0",
			"width" 		: "100%",
			"height" 		: "100%",
			"display"		: "flex",
			"alignContent"	: "center",
			"justifyContent": "center",
			"position"		: "absolute",
		},
		self: {
			
			"pointerEvents": "all",
			"alignSelf"	: "center",
			"position"		: "relative",
		},
		container: {
			"pointerEvents": "none",
			"alignSelf"	: "center",
			"display"		: "flex",
			"alignContent"	: "center",
			"justifyContent": "center",
			"position"		: "relative",
		}
	},

	//gsap animation object
	stage: {
		container: {
			disabled: {
				duration: 0.5,
				css: {
					scale: 0.3,
				},
				ease: Power3.easeOut,				
			},

			enabled: {
				duration: 1,
				css: {
					scale: 1,
				},
				ease: Elastic.easeOut,
				easeParams:[0.3,1]
			},			
		},

		self: {
			disabled: {
				duration: 0.5,
				css: {
					scale: 0.75,
				},
				ease: Power3.easeOut,

			},
			enabled: {
				duration: 0.7,
				css: {
					scale: 1,
				},
				ease: Elastic.easeOut,	
			},			
		}
	},

	getInitialState: function(){
		return {
			distance: this.props.distance,
			width: this.props.beta+'%',
			height: this.props.beta+'%',
			expanded: this.props.expanded || false,
			scale_min: 0,
			scale_max: 1,
			stagger: this.props.stagger || 0.3,
			vertical: false,
			angle: this.props.angle || 0, //90 degrees perpendicular.
		}
	},

	getDefaultProps: function(){
		return {
			expand_duration: 0.8,
			self_angle: null,
			abs_angle: false,
			scale: 1,
			hidden: false,
			distance: 1,
			angle: null,
			circui: true,
			beta: 50,
			padding: 15,
			tangent: true, //
			use_container_scale: true, //child container will scale instead of each child. 
		}
	},

	getChildContext: function() {
		//console.log("GET CTX")
  		return Object.assign({
  			angle: this.state.angle,
  			expanded: this.state.expanded,
  			radius: this.state.radius,
  		},this.setAngles())
  	},

  	contextTypes: {
  		angle: React.PropTypes.number,
  		expanded: React.PropTypes.bool,
		radius: React.PropTypes.number,
		total_angle: React.PropTypes.number,
		child_angles: React.PropTypes.array,
	},

	childContextTypes: {
  		angle: React.PropTypes.number,
		expanded: React.PropTypes.bool,
		radius: React.PropTypes.number,
		total_angle: React.PropTypes.number,
		child_angles: React.PropTypes.array,
	},

	//resize so that w/h ratio remains @ 1:1
	resizeRatio: function(){
		if(this.props.size){
			return {
				width: this.props.size+'px',
				height: this.props.size+'px'
			}
		}
		//console.log(this.refs.root)
		var pw = this.refs.root.parentElement.clientWidth
		var ph = this.refs.root.parentElement.clientHeight
		//console.log(pw,ph);
		return {
			width: 	( !this.state.veritcal ? this.props.beta : (this.props.beta * ( ph / pw )) ) + '%',
			height: ( !this.state.vertical ? (this.props.beta * ( pw / ph )) : this.props.beta ) + '%'
		}
	},

	toStage: function(){
		//var i = this.getIndex();

		var container_stage = this.state.expanded ? this.stage.container.enabled : this.stage.container.disabled;
		var self_stage = this.state.expanded ? this.stage.self.disabled : this.stage.self.enabled;
		
		TweenLite.to(this.refs.container,container_stage.duration,container_stage);
		TweenLite.to(this.refs.self,self_stage.duration,self_stage);
	},


	toDistance: function(d){
		var pos = {
			x: Math.round(Math.cos(this.state.angle)*(this.context.radius*d+this.state.radius)),
			y: Math.round(Math.sin(this.state.angle)*(this.context.radius*d+this.state.radius)),
			ease: Power3.easeOut,
		}
		TweenLite.to(this.refs.root,0.3,pos)
	},

	setXY: function(){
		if( ! this.context.radius ) return;
		
		var pos = {
			x: Math.round(Math.cos(this.state.angle)*(this.context.radius*this.state.distance+this.state.radius)),
			y: Math.round(Math.sin(this.state.angle)*(this.context.radius*this.state.distance+this.state.radius))
		}

		TweenLite.set(this.refs.root,pos)
	},

	isVertical: function(){
		if(this.refs.root.parentElement.cientHeight > this.refs.root.parentElement.cientWidth) return true
		else return false
	},

	//return radius in pixels
	getRadius: function(){
		if(this.props.size) return this.props.size/2;
		var d = this.isVertical() ? this.refs.root.clientHeight : this.refs.root.clientWidth
		return d/100*this.props.beta/2
	},

	shouldClose: function(expand){
		if(this.refs.root.parentElement.expanded == false && this.state.expanded != false){
			return true
		}else{
			return false
		}
	},


	updatedState: function(){
		return Object.assign({
			angle: this.getAngle(),
			vertical: this.isVertical(),
			radius: this.getRadius()
		},this.resizeRatio())
	},

	shouldComponentUpdate: function(props,state){
		var new_state = {};
		//console.log(props.expanded,this.props.expanded)
		if(props.distance != this.props.distance){
			this.toDistance(props.distance)
		}
		//console.log("SHOULD UPDATE",this.props.id,this.state.expanded,this.context.expanded);

		Object.assign(new_state,state,this.updatedState(props));

		if(props.expanded != this.props.expanded){
			new_state.expanded = props.expanded
		}

		if(props.scale != this.props.scale){
			this.toScale(props.scale)
		}

	
		if(this.shouldClose(this.state.expanded)){
			//console.log("SHOULD CLOSE",this.props.id)
			new_state.expanded = false;
			this.setState(new_state);
			return true			
		}else if(_.isEqual(this.state,new_state)){
			return true
		}else{
			this.setState(new_state);
			return true			
		}
	},

	componentDidUpdate: function(props,state){
		// this.setXY();
		this.setXY();



		this.refs.root.style.zIndex = this.state.expanded ? this.getIndex() : 0;
		if(state.expanded !== this.state.expanded){
			this.toStage();				
		}


		//console.log("COMPONENT DID UPDATE",this.props.id)
	},

	componentDidMount: function(){
		/*test*/


		//console.log("CPMPNENT MOUNTED",this.props.id,this.refs.self)
		// this.refs.self.addEventListener('click',function(){
		// 	//console.log("TEST")
		// 	if(this.state.expanded) this.setState({expanded:false});
		// 	else this.setState({expanded:true});
		// }.bind(this));
		/*test*/
		this.setScale(this.props.scale)

		this.refs.container.expanded = this.state.expanded

		TweenLite.set(this.refs.container,{
			scale : this.state.expanded ? '1' : '0.3'
		})

		TweenLite.set(this.refs.self,{
			scale : this.state.expanded ? '0.3' : '1'
		})	

			
		this.setState(this.updatedState());
	},


	setScale: function(scale,root){
		TweenLite.set(this.refs.root,{
			scale : scale
		})	
	},

	toScale: function(scale,root){
		//console.log("to scale")
		TweenLite.to(this.refs.root,0.3,{
			scale : scale,
			ease: Power3.easeOut,
		})	
	},

	//1.84/1.9/1.7 without cloning 
	setAngles: function(){
		if(!this.props.children) return null
		//console.log("SET CHILD ANGELS FOR",this.props.id,this.state.radius)
		var l = this.props.children.length;

		var angles = [0];
		var total_angle = 0;
		var padding = this.props.padding;

		for(var i = 2; i < l; i++){
			var r1 = this.state.radius / 100 * this.props.children[i].props.beta;
			var r2 = this.state.radius / 100 * this.props.children[ i-1 ].props.beta;

			var a = r1+r2+padding;
			var b = this.state.radius+r1;
			var c = this.state.radius+r2;
		
			var angle = Math.acos( ( b*b + c*c - a*a ) / (2*b*c) );

			//console.log("TOTAL ANGLE","a",a,"b",b,"c",c,"angle",angle,total_angle)
			total_angle += angle;
			angles.push(total_angle);
		};

		return {
			child_angles: angles,
			total_angle: total_angle
		}
	},

	getIndex: function(){
		return Array.prototype.indexOf.call(this.refs.root.parentElement.children,this.refs.root);
	},

	getAngle: function(){
		if(this.context.total_angle == null) return this.props.angle;
		var i = this.getIndex();
		//console.log( "GET ANGLE INDEX",i,this.props.id)
		//console.log(this.context.child_angles[i] - this.context.total_angle/2)
		
		if(this.props.self_angle != null){
			a = this.props.self_angle
		}
		else if(!this.props.abs_angle){
			var a =  (this.context.child_angles[i] - this.context.total_angle/2 ) + (this.context.angle ? this.context.angle : 0) + (this.props.offset_angle || 0);
		}else{
			var a =  (this.context.child_angles[i] - this.context.total_angle/2 ) + (this.props.offset_angle || 0);
			
		}


		return a
	},

	
	render: function(){
		//console.log("RENDER",this.props.id,this.props.beta)

		if(this.refs.container != null) this.refs.container.expanded = this.state.expanded;
		//we need to pass an angle to each child, based on their beta and index.

		var dim = {
			width: 	this.props.size != null ? this.props.size+'px' : this.props.beta+'%',
			height: this.props.size != null ? this.props.size+'px' : this.props.beta+'%'
		}



		//console.log("RENDER DIM",dim)
		var children = []
		var firstchild = (this.props.children && this.props.children.length) ? this.props.children[0] : this.props.children;
		if(this.props.children != null){
			for(var i = 0;i<this.props.children.length;i++){
				if (i == 0) continue
				children.push(this.props.children[i])
			}			
		}

		// var children = React.Children.map(this.props.children,function(child,i){
		// 	if (i == 0) return null
		// 	return child;
		// })

		//if(this.props.id != null) console.log(this.props.id, this.context)
		//console.log(typeof this.props.children)
		return (
			<div className = {this.props.rootClass} ref="root" style={Object.assign({},this.styl.root,this.props.rootStyle)}>
				<div ref="root2" style={this.styl.root}>
					<div ref="container" className = {this.props.containerClass} style={Object.assign({},this.styl.container,dim)}>
						{children}
					</div>
				</div>
				<div {...this.props} className={(this.props.selfClass || '')+' c_node'} ref="self" style={Object.assign({},this.styl.self,dim,this.props.selfStyle,this.props.style)}>
					{firstchild}
				</div>
			</div>
		)
	}
})
