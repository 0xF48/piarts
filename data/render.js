var Type = require('./models').Type

function preLoad(){
	Type.find().exec(function(type_list){
		for(var i in type_list){
			type_list[i] = 
		}
	})
}


/*
	config :
		resolution
		zoom
		width
		height
*/

function render(type_name,params,config){

}