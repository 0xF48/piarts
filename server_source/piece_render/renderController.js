/* start node process */
var fs = require('fs')
var cfg = require('../../package.json');
const SIZES = cfg.sizes;
const NW_PATH = cfg.nw_path
const DATA_PATH = cfg.data_path
const LOCALHOST = '127.0.0.1'
var Promise = require('bluebird')
var path = require('path')
const spawn = require('child_process').spawn;

// Scream server example: "hi" -> "HI!!!" 
var net = require('net');


var PORT = 6969;




const bat = spawn(NW_PATH,[__dirname]);


module.exports.renderType = function(type,size){
	return render(type,size,true)
}

module.exports.renderPiece = function(piece,size){
	return render(piece,size,false)
}


function render(piece,size,is_type){
	return new Promise(function(res,rej){
		if(!size || !piece) throw 'bad render params'


		const client = net.connect({port: PORT,readable: true},function(){

			//save path
			var save_path = path.join(__dirname,'../../',DATA_PATH,'/'+(is_type ? 'types' : 'pieces')+'/',typeof size == 'number' ? 'other' : size,piece.id+'.png')
			
		
			//send message to server.
			client.write(JSON.stringify({
				height: typeof size == "number" ? size : SIZES[size],
				width: typeof size == "number" ? size : SIZES[size],
				id :piece.id,
				type_name: is_type ? piece.name : piece.type.name,
				save_path: save_path,
				params: piece.params
			}))


			//when we get message back, server is done rendering and saving the image.
			client.on('end',function(data){

				res(null)
			})
		})
	})
}
