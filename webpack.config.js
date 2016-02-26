var webpack = require("webpack");


var cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{ loader: "jsx-loader" },
		]
	},
	entry: {
		app: "./client_source/main.js",
 		vendor: [
 			"./client_source/node_modules/react",
 			"./client_source/node_modules/gsap/src/uncompressed/TweenMax.js",
 			"./client_source/node_modules/gsap/src/uncompressed/easing/EasePack.js",
 			
 		],
 	},
	output: {
		path: './client_static',
		publicPath: './client_static',
		filename: "bundle.js"
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	],
	// externals: [
	// 	function(context, request, callback) {
	// 		// Every module prefixed with "global-" becomes external
	// 		// "global-abc" -> abc
	// 		if(/^types\//.test(request))
	// 			return callback(null, "commonjs " + "data/types/" + request.substr(6))
 //            callback();
	// 	},
	// ]
}

module.exports = cfg;