

var canvas = document.getElementById('preview');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var fs = require('fs')
var $ = require('jquery')


var RENDER = false


var type_module = null




function render(){
	if(RENDER == false) return requestAnimationFrame(render);
	if(type_module != null) type_module.loop()
	requestAnimationFrame(render);
}
render()


function toggleRender(){
	RENDER = !RENDER
}

document.getElementById('pause-button').addEventListener('click', function(e){
	toggleRender()
})

var dirs = fs.readdirSync('../../../piece_modules/builds/')
dirs = dirs.filter(function(n){return n.match('.common.js$')}).map(function(n){return n.match(/(.+)\.common\.js$/)[1]})
var inputs = $('#params > input')
for(var i in dirs){
	var container = $('<div class="container"><span>'+dirs[i]+'</span></div>')
	$('#types').append(container)

	$(container).on('click',function(i){
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		type_module = null
		type_module = require('../../../piece_modules/builds/'+dirs[i]+'.common.js')(canvas)
		type_module.set([inputs[0].value,inputs[1].value,inputs[2].value,inputs[3].value,inputs[4].value])
		type_module.loop();
	}.bind(this,i))

	
}


inputs.each(function(i,el){
	
	$(el).on('blur',function(){
		console.log("SET",[inputs[0].value,inputs[1].value,inputs[2].value,inputs[3].value,inputs[4].value])

		type_module.set([inputs[0].value,inputs[1].value,inputs[2].value,inputs[3].value,inputs[4].value])
		type_module.loop();
	})
})


$('#types > .container')[2].click()



