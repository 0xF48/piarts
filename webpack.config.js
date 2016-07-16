var webpack = require("webpack");

var cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{test: /\.js$/, loader: "jsx-loader" },
			{ test: /\.scss$/, loaders: ["style", "css", "sass"] }
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
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
		new webpack.ProvidePlugin({
			React: "react",
			"window.React": "react"
		})
	],

}


module.exports = cfg;