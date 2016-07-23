var webpack = require("webpack");
console.log('env: ',process.env.NODE_ENV);
var cfg = {
	devtool: 'source-map',
	resolve: {
    	extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{test: /\.glsl$/, loader: 'raw-loader' },
			{test: /\.jsx$/, loader: "jsx-loader" },
			{test: /\.scss/, loader: 'style-loader!css-loader!postcss-loader!sass-loader' }
		]
	},

	externals: {
		TweenLite: "TweenLite",
		THREE: "THREE"
	},
	entry: {
		main: "./client_source/main.jsx",
		vendor: [
			"gsap/src/minified/TweenMax.min.js",
			"gsap/src/uncompressed/easing/EasePack.js",			
		],
	},
	output: {
		path: './client_static/',
		publicPath: '/static/',
		filename: "[name].bundle.js"
	},
	plugins: [
		new webpack.DefinePlugin({
		    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		new webpack.ProvidePlugin({
			React: "react",
			THREE: "three"
		}),
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	],
}


module.exports = cfg;