/* start node process */
var fs = require('fs')
var cfg = require('../package.json')
const SIZES = cfg.sizes;
const DATA_PATH = cfg.data_path
var Promise = require('bluebird')
var path = require('path')
// const spawn = require('child_process').spawn;
var net = require('net')
const DEV = false
const TYPE_BUILD_PATH = cfg.type_build_path
var type_modules = []
require('colors')

module.exports.renderType = function(type,size){
	return render(type,size,true)
}

module.exports.renderPiece = function(piece,size){
	return render(piece,size,false)
}


var PNG   = require('pngjs').PNG

var fs    = require('fs')



function save(gl,png,width,height,save_path){
	console.log("SAVING....",width,height,save_path);
	var pixels = new Uint8Array(4 * width * height)
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

	var t = 0
	var a, b, g, i, j, k, l, m, n, r, ref, ref1;

	for (j = l = 0, ref = height; 0 <= ref ? l < ref : l > ref; j = 0 <= ref ? ++l : --l) {
		for (i = n = 0, ref1 = width; 0 <= ref1 ? n < ref1 : n > ref1; i = 0 <= ref1 ? ++n : --n) {
			k = j * width + i;
			r = pixels[4 * k];
			g = pixels[4 * k + 1];
			b = pixels[4 * k + 2];
			a = pixels[4 * k + 3];
			m = (height - j + 1) * width + i;
			png.data[4 * m] = r;
			png.data[4 * m + 1] = g;
			png.data[4 * m + 2] = b;
			png.data[4 * m + 3] = a;
			t += r + g + b
		}
	}

	

	var ext = gl.getExtension('STACKGL_destroy_context')
	ext.destroy()

	return new Promise(function(res,rej){
		stream = fs.createWriteStream(save_path)
		png.pack().pipe(stream)
		stream.on('close',()=>{
			delete png;
			res(200)
		})
	})
}


module.exports = function(piece,size,is_type){
	
	if(!size || !piece) throw 'bad render params'

	var type_name = is_type ? piece.name : piece.type.name;
	var id = piece.id;
	var height = width = typeof size == "number" ? size : SIZES[size];
	var gl    = require("gl")(width, height, { preserveDrawingBuffer: true })
	var save_path = path.join(__dirname,'../',DATA_PATH,'/'+(is_type ? 'types' : 'pieces')+'/',typeof size == 'number' ? 'other' : size,piece.id+'.png')
	var piece_path = path.join('../',TYPE_BUILD_PATH,type_name+'.common.js')
	gl.canvas = {
		width: width,
		height: height
	}
	
	var png = new PNG({ width: width, height: height })

	gl.clearColor(1, 0, 0, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)

	if(!DEV && type_modules[type_name] != null) return type_modules[type_name]
	else type_modules[type_name] = require(piece_path)
	
	var mod = type_modules[type_name](null,gl,width,height)
	if(!is_type){
		mod.set(piece.params)
	}
	mod.loop();

	
	return save(gl,png,width,height,save_path);	
}


