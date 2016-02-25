/*
	config :
		resolution
		zoom
		width
		height

*/

var Canvas = require('canvas')
var canvas = new Canvas(2000,2000)
var ctx =  canvas.getContext('2d')
var p = require('bluebird');

function render(piece){
	// ctx.clearRect(0,0,2000,2000)
	return p.resolve(piece)
}

module.exports = render