
var t3 = require('three');



var attributes = {

	displacement: {	type: 'v3', value: [] },
	customColor: {	type: 'c', value: [] }

};

var uniforms = {

	amplitude: { type: "f", value: 5.0 },
	opacity:   { type: "f", value: 0.3 },
	color:     { type: "c", value: new t3.Color( 0xff0000 ) }

};




var shaderMaterial = new t3.ShaderMaterial( {
	uniforms: 		uniforms,
	vertexShader:   document.getElementById( 'vertexshader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
	blending: 		t3.AdditiveBlending,
	depthTest:		false,
	transparent:	true
});


//var circle_geometry = new THREE.BufferGeometry();
var g1 = Math.random()*1000
var g2 = Math.random()*1000
var g3 = Math.random()*1000

var radius= 200 ,edge_count=8000,hair_segments=100,hair_length=15;

var b_geometry = new t3.BufferGeometry();
var b_pos = [];
for(var i = 0;i <= edge_count+1;i++){
	var a = (Math.PI*2)/edge_count*i
	var x = Math.sin(a*Math.sin(i/edge_count*g1*0.5))*Math.sin(a*Math.sin(i/edge_count*g2*0.5))*(radius*Math.sin(i/g3+0.1*Math.random()))
	var y =	Math.sin(a*Math.sin(i/edge_count*g1*0.5))*Math.cos(a*Math.sin(i/edge_count*g2*0.5))*(radius*Math.sin(i/g3+0.1*Math.random()))
	var z = Math.cos(a*Math.sin(i/edge_count*g3*0.5))*Math.cos(a*Math.sin(i/edge_count*g1*0.5))*(radius*Math.sin(i/g3+0.1*Math.random()))
	b_pos.push([x,y,z]);
	


	// var hair = new t3.Line(hair_geom,line_material);
	// hair.rotation.set(0,0,a);
	// //console.log(hair)
	// creature.add(hair);
}

var b_vertices = new Float32Array( b_pos.length * 3 )
for ( var i = 0; i < b_pos.length; i++ )
{
	b_vertices[ i*3 + 0 ] = b_pos[i][0];
	b_vertices[ i*3 + 1 ] = b_pos[i][1];
	b_vertices[ i*3 + 2 ] = b_pos[i][2];
}

var cAttr = new t3.BufferAttribute( b_vertices, 3 );
var dAttr = new t3.BufferAttribute( b_vertices,3 )
b_geometry.addAttribute( 'position', new t3.BufferAttribute( b_vertices, 3 ) );

var cAttr = new t3.Float32Attribute( b_pos.length * 3, 3 );

var color = new t3.Color( 0xffffff );
for( var i = 0, l =  cAttr.count; i < l; i ++ ) {
	color.setHSL( i / l, Math.random(), 0.15 );
	color.toArray(  cAttr.array, i *  cAttr.itemSize );
}

b_geometry.addAttribute( 'customColor',  cAttr);
b_geometry.addAttribute( 'displacement', dAttr);

console.log(b_geometry)





// var line_material = new t3.LineBasicMaterial({
// 	color:  new t3.Color( 0.2+Math.sin(1*Math.random()*Math.sin(time/g1)), 0.8+Math.random()*0.2, 0.00+Math.random()*0.3 )

	
// });
var Creature = function(radius,edge_count,hair_segments,hair_length){

	var circle = new t3.Line(b_geometry, shaderMaterial);
	return {
		obj: circle,
		loop: function(){
			
			var time = Date.now();

			//uniforms.amplitude.value =  0.5 * Math.sin(time/800);
			uniforms.color.value.offsetHSL( 0.002*Math.sin(1*Math.random()*Math.sin(time/g1)), 0 ,0 );


			var array = dAttr.array;

			// for ( var i = 0, l = array.length; i < l; i += 3 ) {

			// 	array[ i     ] += Math.sin( Math.cos(time/500))
			// 	array[ i + 1 ] += Math.sin( Math.cos(time/500))
			// 	array[ i + 2 ] += Math.sin( Math.cos(time/500))

			// }

			dAttr.needsUpdate = true;
		}
	}

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

