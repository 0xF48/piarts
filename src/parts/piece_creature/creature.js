
var t3 = require('three');
var tl = require('gsap')



var uniforms = {
	time: 		{ type: "f", value: 1.0 },
	amplitude: { type: "f", value: 5.0 },
	opacity:   { type: "f", value: 0.3 },
	color:     { type: "c", value: new t3.Color( 0xff0000 ) }
};




var shaderMaterial = new t3.ShaderMaterial({
	uniforms: 		uniforms,
	vertexShader:   document.getElementById( 'vertexshader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
	blending: 		t3.AdditiveBlending,
	depthTest:		false,
	transparent:	true
});
var time = Date.now()
//uniforms.color.value.offsetHSL( 0.002*Math.sin(time/3), 0.1*Math.sin(time/2) ,0.001*Math.sin(time/3) );
			//uniforms.amplitude.value =  amp_min + amp_var * Math.sin(time_sq);
//var circle_geometry = new THREE.BufferGeometry();
var g1,g2,g3;
var setG = function(a,b,c){
	g1 = Math.random()*a
	g2 = Math.random()*b
	g3 = Math.random()*c
}
setG(1000,1000,1000);

var radius= 200 ,edge_count=20000,hair_segments=100,hair_length=15;

var b_geometry = new t3.BufferGeometry();
var b_pos = [];




var pi2 =Math.PI*2;
var inner_circle_count = 200;


function makec(amount,i){
	return (Math.PI*(amount))/edge_count*i
}

var setB = function(){
	b_pos = [];
	for(var i = 0;i <= edge_count+1;i++){

		var a = pi2/edge_count*i

		var offset = 5*Math.sin(i/500/g2*g3);

	

		var x_variation = Math.sin(i/g1);
		var y_variation = Math.sin(i/g2);
		var z_variation = Math.sin(i/g3);


		var multi_circle = makec(5+g2/g3,i)
		var multi_circle2 = makec(20+g1/g2,i)

		var rad = (radius + 30)


		var x = Math.cos(a*Math.cos(Math.cos(multi_circle))) * rad/g2*g1 * Math.sin(a) + x_variation
		var y =	Math.sin(a*Math.sin(Math.sin(multi_circle2)*Math.cos(multi_circle))) * rad * Math.sin(a) + y_variation
		var z = 10*Math.cos(Math.tan(multi_circle2*multi_circle*i/g1)*i/g2) + 20*offset
		b_pos.push([x,y,z]);
	}	
}

var c_pos = [];
var setC = function(){
	c_pos = [];
	
	for(var i = 0;i< 10;i++){

	}

	for(var i = 0;i <= edge_count+1;i++){

	}
}

// var postA = function(){



// 	for(var i = 0,l = b_pos.length;i < l;i++){
// 		b_pos[i][0] += 
// 		b_pos[i][1] += 
// 		b_pos[i][2] += 
// 	}
// }
setB();


var b_vertices = new Float32Array( b_pos.length * 3 )
for ( var i = 0; i < b_pos.length; i++ )
{
	b_vertices[ i*3 + 0 ] = b_pos[i][0];
	b_vertices[ i*3 + 1 ] = b_pos[i][1];
	b_vertices[ i*3 + 2 ] = b_pos[i][2];
}

var cAttr = new t3.BufferAttribute( b_vertices, 3 );
var dAttr = new t3.BufferAttribute( b_vertices,3 )
b_geometry.addAttribute( 'position', dAttr );
b_geometry.addAttribute( 'customColor',  cAttr);



var color = new t3.Color( 0xffffff );
var d = Date.now();
for( var i = 0, l =  cAttr.count; i < l; i ++ ) {
	
	color.setHSL( i/l, i/l/1.5 , 0.3+0.12*Math.sin(d) );
	color.toArray(  cAttr.array, i *  cAttr.itemSize );
}


b_geometry.addAttribute( 'displacement', dAttr);

console.log(b_geometry)

var stage = {
	a: 0
}

var Creature = function(radius,edge_count,hair_segments,hair_length){
	
	var circle = new t3.Line(b_geometry, shaderMaterial);
	
	var amp_min = 10;
	var amp_var = 0.01;
	var dissipate = false;
	var creat = {
		obj: circle,

		fazeout: function(cb){
			var array = dAttr.array;
			setG(1000,1000,1000);
			tl.fromTo(stage,3,{a:0},{
				a: 5,
				ease: Cubic.EaseIn,
				onUpdate: function(){
					var time = Date.now();
					for ( var i = 0, l = b_pos.length; i < l; i ++ ) {
						array[ i*3 + 0 ] += (-0.5+Math.random())*((i/l))*stage.a
						array[ i*3 + 1 ] += (-0.5+Math.random())*((i/l))*stage.a
						array[ i*3 + 2 ] += (-0.5+Math.random())*((i/l))*stage.a					
					}
					dAttr.needsUpdate = true;
				},
				onComplete: creat.fazein
			})
		},
		fazein: function(cb){
			var array = dAttr.array;

			tl.fromTo(stage,3,{a:0},{
				a: 1,
				ease: Power1.easeIn,
				onStart: function(){
					setG(1000,1000,1000);
					setB();
				},
				onUpdate: function(){
					for ( var i = 0, l = b_pos.length; i < l; i ++ ) {
						array[ i*3 + 0  ] +=  ( b_pos[i][0] - array[ i*3 + 0  ] )*stage.a
						array[ i*3 + 1 ]  +=  ( b_pos[i][1] - array[ i*3 + 1  ] )*stage.a
						array[ i*3 + 2 ]  +=  ( b_pos[i][2] - array[ i*3 + 2  ] )*stage.a
					}
					dAttr.needsUpdate = true;
				},
				onComplete: function(){
					
					creat.fazeout();
				}
			});
		},

		colors: function(){
			uniforms.time = Date.now()/700;
			var time = Date.now()/700;
			var time_sq = time + 2*Math.sin(time)
			uniforms.color.value.offsetHSL( 0.002*Math.sin(time/3), 0.1*Math.sin(time/2) ,0.001*Math.sin(time/3) );
			//uniforms.amplitude.value =  amp_min + amp_var * Math.sin(time_sq);
		},


	}

	return creat

	var circle_verts = [];
	var circle_geom = new t3.Geometry();

	var creature = new t3.Object3D();


	var hairs = [];


	var hair_verts = [];
	var displacement = Math.random();
	for(var j = 0;j<hair_segments;j++){
		hair_verts.push(new t3.Vector3(radius+hair_length/hair_segments*j,displacement+Math.sin(j/hair_segments*10),0));
	}
	var hair_geom = new t3.Geometry();
	hair_geom.vertices = hair_verts


	for(var i = 0;i <= edge_count+1;i++){
		var a = (Math.PI*2)/edge_count*i
		var x = Math.cos(a)*radius
		var y =	Math.sin(a)*radius
		circle_verts.push(new t3.Vector3(x,y,0));
		


		var hair = new t3.Line(hair_geom,line_material);
		hair.rotation.set(0,0,a);
		//console.log(hair)
		creature.add(hair);
	}
	

	circle_geom.vertices = circle_verts;
	var circle = new t3.Line(circle_geom, line_material);
	creature.add(circle);



	return {
		obj: circle,
		loop: funct
	}
}

module.exports = Creature;

