
var vertexShader = require('./vs.glsl')
var fragmentShader = require('./fs.glsl')

var Creature = function(radius,edge_count,hair_segments,hair_length,cfg){
	



	var uniforms = {
		time: 	   { type: "f", value: 1.0 },
		amplitude: { type: "f", value: 5.0 },
		opacity:   { type: "f", value: 0.3 },
		color:     { type: "c", value: new THREE.Color( 0xff0000 ) },
	};

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: 		uniforms,
		vertexShader:   vertexShader,
		fragmentShader: fragmentShader,
		blending: 		THREE.AdditiveBlending,
		depthTest:		false,
		transparent:	true
	});
	var time = Date.now()

	var g1,g2,g3;
	var setG = function(cfg){
		g1 = cfg[0]
		g2 = cfg[1]
		g3 = cfg[2]
	}

	setG([Math.random(),Math.random(),Math.random()])


	//console.log(g1,g2,g3);

	var radius= 500 ,edge_count=9000

	var b_geometry = new THREE.BufferGeometry();
	var b_pos = [];
	var c_pos = [];
	var o_pos = [];

	var pi2 =Math.PI*2;
	var inner_circle_count = 200;

	function makec(amount,i){
		return (Math.PI*(amount))/edge_count*i
	}


	var vcenter = new THREE.Vector3(0,0,0); 



	var setB = function(){
		b_pos = [];
		c_pos = [];
		o_pos = [];

		for(var i = 0;i <= edge_count+1;i++){

			var a = pi2/edge_count*i

			var offset = 50*Math.sin(i/500/g2*g3);

		

			var x_variation = Math.sin(i/g1);
			var y_variation = Math.sin(i/g2);
			var z_variation = Math.sin(i/g3);


			var multi_circle = makec(g2/g3,i)
			var multi_circle2 = makec(g1/g2,i)
			var multi_circle3 = makec(g3/g1,i)

			var rad = (radius + 30)


			var x = Math.cos(a*Math.cos(Math.sin(multi_circle)*Math.cos(multi_circle))) * rad * Math.sin(a) + x_variation
			var y =	Math.sin(a*Math.sin(Math.cos(multi_circle2)*Math.tan(multi_circle2)*Math.cos(multi_circle))) * rad * Math.sin(a) + y_variation;
			// var x = x + 10*Math.cos(y)
			// var y = y + 10*Math.sin(x)

			var z = 1*Math.sin(a*Math.cos(Math.sin(multi_circle))) * Math.cos(a)*Math.cos(a) * rad 
			

			

			var r = Math.sin(i/(g1*g2*2000));
			var g = Math.sin(i/(g2*g3*2000));
			var b = Math.sin(i/(g3*g1*2000));

			var vpos = new THREE.Vector3(x,y,z);

			var d = vpos.distanceTo(vcenter);

			var opacity =  d/4000*Math.sin(i/(g1*g2*g3*6000));


			b_pos.push([x,y,z]);
			c_pos.push([r,g,b])
			o_pos.push(opacity)
		}
	}



	setB();

	var b_vertices = new Float32Array( b_pos.length * 3 )
	for ( var i = 0; i < b_pos.length; i++ )
	{
		b_vertices[ i*3 + 0 ] = b_pos[i][0];
		b_vertices[ i*3 + 1 ] = b_pos[i][1];
		b_vertices[ i*3 + 2 ] = b_pos[i][2];
	}

	var c_vertices = new Float32Array( b_pos.length * 3 );
	for ( var i = 0; i < b_pos.length; i++ )
	{
		c_vertices[ i*3 + 0 ] = c_pos[i][0];
		c_vertices[ i*3 + 1 ] = c_pos[i][1];
		c_vertices[ i*3 + 2 ] = c_pos[i][2];
	}	

	var o_vertices = new Float32Array( b_pos.length );
	for ( var i = 0; i < b_pos.length; i++ )
	{
		
		
		
		
		o_vertices[ i ] = o_pos[i]//Math.abs(Math.sin(Math.cos(i/50)))/(2-Math.sin(i/90));
	}

	var cAttr = new THREE.BufferAttribute( c_vertices, 3 );
	var dAttr = new THREE.BufferAttribute( b_vertices,3 );
	var oAttr = new THREE.BufferAttribute( o_vertices,1 );
	b_geometry.addAttribute( 'position', dAttr );
	b_geometry.addAttribute( 'customColor',  cAttr);
	b_geometry.addAttribute( 'customOpacity',  oAttr);

	var color = new THREE.Color( 0xffffff );
	// var d = Date.now();
	// for( var i = 0, l =  cAttr.count; i < l; i ++ ) {
	// 	color.setHSL( 0.5,0.5,0.5 );
	// 	color.toArray(  cAttr.array, i *  cAttr.itemSize );
	// }

	b_geometry.addAttribute( 'displacement', dAttr);

	//console.log(b_geometry)

	var stage = {
		a: 0
	}

	var init = function(radius,edge_count,hair_segments,hair_length,cfg){
		
		var circle = new THREE.Line(b_geometry, shaderMaterial);
		
		var amp_min = 10;
		var amp_var = 0.01;
		var dissipate = false;
		var creat = {
			obj: circle,

			reset: function(cfg){
				//console.log("RESET")
				setG(cfg)
				setB();
				var array = dAttr.array;
				for ( var i = 0, l = b_pos.length; i < l; i ++ ) {
					array[ i*3 + 0 ] = b_pos[i][0];
					array[ i*3 + 1 ] = b_pos[i][1];
					array[ i*3 + 2 ] = b_pos[i][2];				
				}
				dAttr.needsUpdate = true;
				var array = cAttr.array;
				for ( var i = 0, l = c_pos.length; i < l; i ++ ) {
					array[ i*3 + 0 ] = c_pos[i][0];
					array[ i*3 + 1 ] = c_pos[i][1];
					array[ i*3 + 2 ] = c_pos[i][2];				
				}
				cAttr.needsUpdate = true;

				var array = oAttr.array;
				for ( var i = 0,l=o_pos.length; i < l; i++ ){
					array[i] = o_pos[i]
				}
				oAttr.needsUpdate = true;
			
			},


			fazeout: function(cfg){
				//console.log("FAZEOUT",cfg)
				setG(cfg);

				var array = dAttr.array;
				// TweenLite.fromTo(stage,2,{a:0},{
				// 	a: 5,
				// 	ease: Cubic.EaseIn,
				// 	onUpdate: function(){
				// 		var time = Date.now();
				// 		for ( var i = 0, l = b_pos.length; i < l; i ++ ) {
				// 			array[ i*3 + 0 ] += (-0.5+Math.random())*((i/l))*stage.a
				// 			array[ i*3 + 1 ] += (-0.5+Math.random())*((i/l))*stage.a
				// 			array[ i*3 + 2 ] += (-0.5+Math.random())*((i/l))*stage.a					
				// 		}
				// 		dAttr.needsUpdate = true;
				// 	},
				// 	onComplete: creat.fazein
				// });
				TweenLite.fromTo(stage,2,{a:0},{
					a: 1,
					ease: Power1.easeIn,
					onStart: function(){
						console.log("START FAZE IN")
						setB();
					},
					onUpdate: function(){
						for ( var i = 0, l = b_pos.length; i < l; i ++ ) {
							array[ i*3 + 0  ] +=  ( b_pos[i][0] - array[ i*3 + 0  ] )*stage.a
							array[ i*3 + 1 ]  +=  ( b_pos[i][1] - array[ i*3 + 1  ] )*stage.a
							array[ i*3 + 2 ]  +=  ( b_pos[i][2] - array[ i*3 + 2  ] )*stage.a
						}
						dAttr.needsUpdate = true;
						//console.log("TEST");
					},
				});
			},

			fazein: function(cb){
				var array = dAttr.array;

				TweenLite.fromTo(stage,1,{a:0},{
					a: 1,
					ease: Power1.easeIn,
					onStart: function(){
						console.log("START FAZE IN")
						setB();
					},
					onUpdate: function(){
						for ( var i = 0, l = b_pos.length; i < l; i ++ ) {
							array[ i*3 + 0  ] +=  ( b_pos[i][0] - array[ i*3 + 0  ] )*stage.a
							array[ i*3 + 1 ]  +=  ( b_pos[i][1] - array[ i*3 + 1  ] )*stage.a
							array[ i*3 + 2 ]  +=  ( b_pos[i][2] - array[ i*3 + 2  ] )*stage.a
						}
						dAttr.needsUpdate = true;
						//console.log("TEST");
					},
				});
			},

			colors: function(color){
				//uniforms.color.value.offsetHSL(color.h,color.s,color.l);
			},
		}

		creat.colors({
			h: 0,
			s: 0,
			l: 0
		});

		return creat
	}

	return init;
}

module.exports = Creature;