
module.exports = 
{
	creature: require('./creature')
	//thread:require('./pieces/thread') /*TODO*/
};



/*
INPUT:
{
	canvas: -- canvas element where to start render,
	state: -- configuration object
}
------------------
OUTPUT:
{
	loop: function() -- main render loop.
	set: function(cfg) -- state setter
}

*/