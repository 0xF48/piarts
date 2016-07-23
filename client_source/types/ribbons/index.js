// if( typeof global != 'undefined') global.THREE = require('three')
// else if(typeof window != 'undefined') window.THREE = require('three')

var THREE = require('three');

var Creature = require('./creature.js')
require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/shaders/CopyShader.js');
require('three/examples/js/shaders/FXAAShader.js');
require('three/examples/js/shaders/ConvolutionShader.js');
require('three/examples/js/shaders/DigitalGlitch.js');
require("three/examples/js/postprocessing/EffectComposer.js");
require("three/examples/js/postprocessing/RenderPass.js");
require("three/examples/js/postprocessing/MaskPass.js");
require("three/examples/js/postprocessing/ShaderPass.js");
require("three/examples/js/postprocessing/GlitchPass.js");
require("three/examples/js/postprocessing/BloomPass.js");





// console.log(controls)
var center = new THREE.Vector3(0,0,0);


var r = 0
var rotate_piece = function(piece){
	return function(){
		piece.rotation.set(Math.sin(r+=0.0001),Math.sin(r+=0.0001),Math.sin(r+=0.0001));
	}
}



var default_params = [0.5,0.5,0.5]




var init = function(el,default_params){
	var main_creature = null;
	var gl = null
	var width = el.clientWidth
	var height = el.clientHeight	
	var loop = {};
	var cam = new THREE.PerspectiveCamera(45,1.5,1,1000000);
	var scene = new THREE.Scene();



	var resolution = 1;
	var cfg;
	if(el){
		cfg = {
			preserveDrawingBuffer: true,
			antialias: false,
			canvas: el,
			precision: "highp",			
		}
	}else{
		cfg = {
			preserveDrawingBuffer: true,
			antialias: false,
			canvas: {
				width: width,
				height: height
			},
			context: gl,
			precision: "highp",				
		}
	}

	var renderer = new THREE.WebGLRenderer(cfg);
	renderer.setClearColor(0x000000, 1.0);

	
	if(typeof window !== 'undefined' && el && window != null){
		window.addEventListener('resize',function(){

			cam.aspect = el.width/el.height;
			renderer.setSize(el.width,el.height);
			cam.updateProjectionMatrix();
		})
	}
	
	var controls
	if(el){
		cam.aspect = el.width/el.height;
		controls = new THREE.OrbitControls( cam, el );
		controls.enableZoom = false;
	}else{
		cam.aspect = width/height
	}

	cam.updateProjectionMatrix();
	
	

	
	
	cam.position.z = 3000;
	cam.lookAt(new THREE.Vector3(0,0,0));


	

	

	var creatures = [];

	var piece = new THREE.Object3D()

	var spread = 500;
	
	var creature_templ = new Creature();
	
	for(var i = 0;i<30;i++){
		var creature = creature_templ(20,7,5,20,default_params)
		creature.obj.position.set(-spread/2+Math.random(63125613414)*spread,-spread/2+Math.random(112312323)*spread,-spread/2+Math.random(767777777)*spread);
		creature.obj.rotation.set(Math.PI*5*Math.random(),Math.PI*5*Math.random(),Math.PI*5*Math.random());
		piece.add(creature.obj);
		if(i == 0) main_creature = creature;
	}


	loop.loops = [];
	//loop.loops.push(creature.colors);
	
	scene.add(piece);
	// loop.loops.push(rotate_piece(piece));


	main_creature.colors({
		h:0.4,
		s:0.1,
		l:-0.3,
	});

	main_creature.reset(default_params);		
	renderer.autoClear = false;
	var composer = new THREE.EffectComposer( renderer );

	var effectBloom2 = new THREE.BloomPass(3,25,4.0,256*2);
	var effectBloom = new THREE.BloomPass(1.35,6,1.0,256*2);	

	
	var renderModel = new THREE.RenderPass( scene, cam );
	// var effectBloom3 = new THREE.BloomPass(0.5,45,10.0,256*2);

	var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

	// effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	// window.e1 = effectBloom2
	// window.e2 = effectBloom

	// effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );

	effectCopy.renderToScreen = true;

	composer = new THREE.EffectComposer( renderer );
	
	// window.comp = composer


	composer.addPass( renderModel );
	composer.addPass( effectBloom );
	
	composer.addPass( effectBloom2 );
	// if(max){
	// 	composer.addPass( effectBloom2 );
	// }	

	composer.addPass( effectCopy );



	
	


	// composer.addPass( cPass );



	main_creature.reset([0.5,0.5,0.5]);
	loop.main = function(){
		// cam.aspect = el.width/el.height;
		// renderer.setSize(el.width/resolution,el.height/resolution,false);		
		for(var i = 0;i<loop.loops.length;i++){
			loop.loops[i]();
		}

		composer.render();
	}
	
	loop.main();

	return {main_creature: main_creature, renderer: renderer,loop:loop.main};
}







module.exports = function(canvas,max){

	var opt = new init(canvas,default_params);

	//return setter and loop.
	return {
		//must return setter
		set: function(params){
			opt.main_creature.reset(params);
		},
		renderer: opt.renderer,
		//must return
		loop: opt.loop,
		// renderer: opt.renderer 
	}
}





