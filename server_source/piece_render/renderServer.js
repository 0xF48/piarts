const DEV = require('../../package.json').dev
const TYPE_BUILD_PATH = require('../../package.json').type_build_path




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


    client.on('data',function(data){
		console.log("GOT DATA")
		var logger = document.getElementById('logger')
		var canvas = document.getElementById('canvas')

		// document.body.removeChild(canvas)
		// var canvas = document.createElement('canvas')
		// canvas.setAttribute('id','canvas')
		// document.body.insertBefore(canvas,logger)

		var piece = JSON.parse(data)
		log(piece.type.name+'  ['+piece.params+']  #'+piece.id+' '+piece.width+'x'+piece.height)

		


		canvas.width = piece.width
		canvas.height = piece.height



		var constructor = loadTypeModule(piece.type.name)
		console.log(canvas.height,canvas.width)

		var module = constructor()[1](canvas)


		module.set(piece.params)
		module.loop()
		var dataURL = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");

		console.log(dataURL);


		client.write(dataURL)
		client.destroy()

	})

}).listen(PORT, HOST);







function loadTypeModule(type_name){
	if(!DEV && type_modules[type_name] != null) return type_modules[type_name]
	else type_modules[type_name] = require(path.join('../..',TYPE_BUILD_PATH,type_name+'.common.js'))
	return type_modules[type_name]
}