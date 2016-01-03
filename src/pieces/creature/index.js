var t3 = require('three');
var tl = require('gsap');







var Creature = require('./creature.js')


// console.log(controls)
var center = new t3.Vector3(0,0,0);

// var cam_play1 = function(){
// 	var rad = 000;
// 	return function(){
// 		var time = Date.now() / ( 2000 * 2 );
// 		cam.position.set(Math.cos(time/20)*rad,Math.sin(time/20)*rad,0)
// 		cam.lookAt(center);
// 	}
// }

var rotate_piece = function(piece){
	return function(){
		var time = Date.now() / ( 2000 * 10 );
		piece.rotation.set(Math.sin(time),Math.sin(time),Math.sin(time));
	}
}


var cfg = {
	a : Math.random(),
	b : Math.random(),
	c : Math.random(),
}



var main_creature = null;
var init = function(el,cfg){
	var OrbitControls = require('three-orbit-controls')(t3)
	var loop = {};
	var cam = new t3.PerspectiveCamera(45,1.5,1,1000000);
	var scene = new t3.Scene();
	var controls = new OrbitControls(cam,el);
	controls.autoRotate = true;
	controls.update();

	var resolution = 1;

	var renderer = new t3.WebGLRenderer({
		preserveDrawingBuffer: true,
		antialias: false,
		canvas: el,
		precision: "highp",
	});
	renderer.setClearColor(0x000000, 1.0);


	console.log(el.clientWidth,el.clientHeight,el.width,el.height)
	if(!el.clientWidth || !el.clientHeight){
		console.log("NO CLIENT WIDTH")
		cam.aspect = el.width/el.height;
		renderer.setSize(el.width/resolution,el.height/resolution,false);
	}else{
		cam.aspect = el.clientWidth/el.clientHeight;
		renderer.setSize(el.clientWidth/resolution,el.clientHeight/resolution,false);		
	}

	cam.updateProjectionMatrix();
	
	//console.log(cam)

	
	
	cam.position.z = 3000;
	cam.lookAt(new t3.Vector3(0,0,0)); 

	var creatures = [];

	var piece = new t3.Object3D()

	var spread = 600;
	
	var creature_templ = new Creature();
	
	for(var i = 0;i<20;i++){
		var creature = creature_templ(20,7,5,20,cfg)
		creature.obj.position.set(-spread/2+Math.random(63125613414)*spread,-spread/2+Math.random(112312323)*spread,-spread/2+Math.random(767777777)*spread);
		creature.obj.rotation.set(Math.PI*2*Math.random(),Math.PI*2*Math.random(),Math.PI*2*Math.random());
		piece.add(creature.obj);
		if(i == 0) main_creature = creature;
	}


	loop.loops = [];
	//loop.loops.push(creature.colors);
	
	scene.add(piece);
	loop.loops.push(rotate_piece(piece));

	renderer.render(scene, cam);

	main_creature.colors({
		h:0.4,
		s:0.1,
		l:-0.3,
	});

	main_creature.reset(cfg);		



	renderer.render(scene, cam);
	


	
	loop.main = function(){
		for(var i = 0;i<loop.loops.length;i++){
			loop.loops[i]();
		}
		renderer.render(scene, cam);
	}
	
	loop.main();

	return loop.main;
}





module.exports = function(opt){

	var main_loop = new init(opt.canvas,opt.cfg);

	return {
		loop: main_loop,
		set: function(cfg){
			main_creature.reset(cfg);
			main_loop();
		}
	};
}


