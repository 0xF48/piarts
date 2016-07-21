var webpack = require("webpack");
var cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{test: /\.js$/, loader: "jsx-loader" },
			{test: /\.scss/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' }
		]
	},
	externals: {
		TweenLite: "TweenLite"
	},
	entry: {
		main: "./client_source/main.js",
		vendor: [
			"gsap/src/minified/TweenMax.min.js",
			"gsap/src/uncompressed/easing/EasePack.js",			
		],
	},
	output: {
		path: './client_static',
		publicPath: './client_static',
		filename: "[name].bundle.js"
	},
	plugins: [
		new webpack.ProvidePlugin({
			React: "react",
		}),
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	],
}


module.exports = cfg;