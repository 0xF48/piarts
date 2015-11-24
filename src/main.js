var t3 = require('three');



var scene = new t3.Scene();
var cam = new t3.PerspectiveCamera(45,1.5,1,1000000);
var renderer = new t3.WebGLRenderer({
	antialias: false
});
renderer.setClearColor(0x000000, 1.0)
var OrbitControls = require('three-orbit-controls')(t3)
var controls = new OrbitControls(cam)

var Creature = require('./creature.js')









var init = function(){


	var resolution = 1;
	renderer.domElement.setAttribute('id','main');
	document.body.appendChild(renderer.domElement);
	cam.aspect = window.innerWidth/window.innerHeight;
	cam.updateProjectionMatrix();
	console.log(cam)

	renderer.setSize(window.innerWidth/resolution,window.innerHeight/resolution,false);
	
	cam.position.z = 7000;
	cam.lookAt(new t3.Vector3(0,0,0)); 

	var creatures = [];

	var spread = 0;

	for(var i = 0;i<100;i++){
		var creature = Creature(20,7,5,20);
		creature.obj.position.set(-spread/2+Math.random(63125613414)*spread,-spread/2+Math.random(112312323)*spread,-spread/2+Math.random(767777777)*spread);
		creature.obj.rotation.set(Math.PI*2*Math.random(),Math.PI*2*Math.random(),Math.PI*2*Math.random());
		//creature.obj.rotation.set(0.1,0.3,Math.PI*2*Math.random());
		//console.log(creature.obj);
		scene.add(creature.obj);
		if(i == 0){
			loop.loops.push(creature.loop);		
		}

	}

	

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