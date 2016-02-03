//some class.
var Piece = function(canvas){

	var c = canvas;
	var ctx = canvas.getContext("2d");
	
	var param_buffer = [];
	

	//private method
	var print = function(){
		//console.log('example render params : ' + param_buffer)
	}
	
	return {
		//public method
		loop: function(){
			c.width = c.parentElement.clientWidth;
			c.height = c.parentElement.clientHeight;
		
			ctx.clearRect(0,0,c.width,c.height)
			ctx.font = "23px Arial"
			ctx.fillStyle = "rgba(0,255,255,0.6)"	
			ctx.fillText( Math.round((param_buffer[0]*param_buffer[1]/param_buffer[2]-param_buffer[3]+param_buffer[4])*10000)/10000  , c.width/2-40, c.height/2-200)
		},
		param_buffer: param_buffer
	}
}

//example piece constructor with hooks.
module.exports = [[0.5,0.5,0.5,0.5,0.5],function(canvas){
	//construct some objects here..
	var toy = new Piece(canvas);

	window.toy = toy
	
	//return setter and loop.
	return {
		//must return setter
		set: function(params){
			toy.param_buffer[0] = params[0] // params is an object.
			toy.param_buffer[1] = params[1] // params is an object.
			toy.param_buffer[2] = params[2] // params is an object.
			toy.param_buffer[3] = params[3] // params is an object.
			toy.param_buffer[4] = params[4] // params is an object.
		},
		//must return
		loop: toy.loop
	}
}]