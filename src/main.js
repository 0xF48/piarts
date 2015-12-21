var t3 = require('three');
var tl = require('gsap');


var scene = new t3.Scene();
var cam = new t3.PerspectiveCamera(45,1.5,1,1000000);
var renderer = new t3.WebGLRenderer({
	antialias: false
});
renderer.setClearColor(0x000000, 1.0)
var OrbitControls = require('three-orbit-controls')(t3)
var controls = new OrbitControls(cam)

var Creature = require('./creature.js')
controls.autoRotate = true;
controls.update();

console.log(controls)
var center = new t3.Vector3(0,0,0);

var cam_play1 = function(){
	var rad = 4000;
	return function(){
		var time = Date.now() / ( 2000 * 2 );
		cam.position.set(Math.cos(time/20)*rad,Math.sin(time/20)*rad,0)
		cam.lookAt(center);
	}
}

var rotate_piece = function(piece){
	
	return function(){
		var time = Date.now() / ( 2000 * 10 );
		piece.rotation.set(Math.sin(time),Math.sin(time),Math.sin(time));
	}
}



var init = function(){


	var resolution = 1;
	renderer.domElement.setAttribute('id','main');
	document.body.appendChild(renderer.domElement);
	cam.aspect = window.innerWidth/window.innerHeight;
	cam.updateProjectionMatrix();
	console.log(cam)

	renderer.setSize(window.innerWidth/resolution,window.innerHeight/resolution,false);
	
	cam.position.z = 4000;
	cam.lookAt(new t3.Vector3(0,0,0)); 

	var creatures = [];

	var piece = new t3.Object3D()

	var spread = 600;

	for(var i = 0;i<50;i++){
		var creature = Creature(20,7,5,20);
		creature.obj.position.set(-spread/2+Math.random(63125613414)*spread,-spread/2+Math.random(112312323)*spread,-spread/2+Math.random(767777777)*spread);
		creature.obj.rotation.set(Math.PI*2*Math.random(),Math.PI*2*Math.random(),Math.PI*2*Math.random());
		//creature.obj.rotation.set(0.1,0.3,Math.PI*2*Math.random());
		//console.log(creature.obj);
		piece.add(creature.obj);
		if(i == 0){
			loop.loops.push(creature.colors);
			setTimeout(function(){
				creature.fazeout()
			},1000)
			//setTimeout(creature.fazein,4000)

			//setTimeout(creature.end, 5000);
			//setTimeout(creature.end, 7000);
		}
	}

	scene.add(piece);

	loop.loops.push(rotate_piece(piece));

	
	//loop.loops.push(cam_play1());

	

	loop.main();
}





var loop = {
	main: function(){
		requestAnimationFrame(loop.main);
		for(var i = 0;i<loop.loops.length;i++){
			loop.loops[i]();
		}
		renderer.render(scene, cam);
	},
	loops: []
}


init();