var webpack = require("webpack");
var fs = require('fs')

var global_cfg = {
	devtool: 'source-map',
	entry: (function(){
		var entries = fs.readdirSync('./src');
		var ret = {}
		for(var i in entries){
			ret[entries[i]] = './src/'+entries[i]
		}
		return ret
	})(),
	// module: {
	//     loaders: [
	//         { test: /\.glsl$/, loader: 'raw' },
	//     ],
	// },
}


module.exports = [ Object.assign({
	output: {
		libraryTarget: 'amd', 
		path: './builds',
		filename: "[name].amd.js",
		sourceMapFilename: "[file].amd.map",
	},
},global_cfg),Object.assign({
	output: {
		library: true,
		libraryTarget: 'commonjs2',
		path: './builds',
		filename: "[name].common.js",
		sourceMapFilename: "[file].common.map",
	},
},global_cfg)]