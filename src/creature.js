
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

var radius= 200 ,edge_count=5000,hair_segments=100,hair_length=15;

var b_geometry = new t3.BufferGeometry();
var b_pos = [];




var pi2 =Math.PI*2;
var inner_circle_count = 200;


function makec(amount,i){
	return (Math.PI*(amount))/edge_count*i
}

for(var i = 0;i <= edge_count+1;i++){

	var a = pi2/edge_count*i

	var offset = 5*Math.sin(i/500);

	var randoms = [Math.random(8710),Math.random(5431),Math.random(1234)]

	var x_variation = Math.sin(i/g1);
	var y_variation = Math.sin(i/g2);
	var z_variation = Math.sin(i/g3);


	var multi_circle = makec(5,i)
	var multi_circle2 = makec(3,i)

	var rad = (radius + 30*Math.sin(multi_circle2))*Math.sin(Math.tan(a))


	var x = Math.sin(a) * rad + x_variation
	var y =	Math.sin(a*Math.cos(Math.cos(multi_circle2))) * rad + y_variation
	var z = 10*Math.cos(Math.sin(multi_circle2)) + 20*offset
	b_pos.push([x,y,z]);
	
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
	color.setHSL( i/l, i/l , 0.5 );
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
	
	var amp_min = 10;
	var amp_var = 0.1;
	return {
		obj: circle,
		loop: function(){
			
			var time = Date.now()/700;

			var time_sq = time + 2*Math.sin(time)





			uniforms.amplitude.value =  amp_min + amp_var * Math.sin(time_sq);

			uniforms.color.value.offsetHSL( 0.002*Math.sin(time/3), 0 ,0 );


			var array = dAttr.array;

			// for ( var i = 0, l = array.length; i < l; i += 3 ) {
			// 	//var a = (Math.PI*2)/edge_count*i
			// 	array[ i     ] += 4*Math.sin(time)
			// 	array[ i + 1 ] += 4*Math.sin(time)
			// 	array[ i + 2 ] += 4*Math.sin(time)
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

