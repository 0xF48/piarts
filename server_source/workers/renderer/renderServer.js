var cfg = require('../../../package.json')
const DEV = false//cfg.dev 
const TYPE_BUILD_PATH = cfg.type_build_path
const DATA_PATH = cfg.data_path

var fs = require('fs')
var BufferStream = require('buffer').BufferStream

var HOST = '127.0.0.1';
var PORT = 6969;
var path = require('path')
var net = require('net')


var log = function(msg){
	document.getElementById('logger').innerHTML = msg
}

var type_modules = []




net.createServer({allowHalfOpen: false},function(client) {


    if(client.remoteAddress != HOST){
        throw "bad address: "+client.remoteAddress
        client.end("hello")
    }

    // client.setNoDelay()
		


    client.on('data',function(data){
    	//dom ref
		var logger = document.getElementById('logger')
		var canvas = document.getElementById('canvas')
		


		//piece or type
		var piece = JSON.parse(data)

		//set image width / height
		canvas.width = piece.width
		canvas.height = piece.height

		//log piece
		log(piece.type_name+'  ['+piece.params+']  #'+piece.id+' '+piece.width+'x'+piece.height)





		//load module
		var module = loadTypeModule(piece.type_name)(canvas)

		//loop with params.
		module.set(piece.params);
		module.loop();


		//get canvas data to png
		var dataURL = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
		var buffer = new Buffer(dataURL,'base64')
		


		fs.writeFile(piece.save_path,buffer,'binary',function(err){
			client.destroy()
			log('waiting for connections')
		})
	})

}).listen(PORT, HOST);







function loadTypeModule(type_name){
	if(!DEV && type_modules[type_name] != null) return type_modules[type_name]
	else type_modules[type_name] = require(path.join('../../..',TYPE_BUILD_PATH,type_name+'.common.js'))
	return type_modules[type_name]
}