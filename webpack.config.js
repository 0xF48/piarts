var webpack = require("webpack");
var path = require('path');
var colors = require('colors');

var cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{test: /\.js$/, loader: "jsx-loader" },
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

}


var gulp = require('gulp');
var sass = require('gulp-sass');

function runsass() {
  return gulp.src('./client_source/style/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client_static'))
    .on('end',function(v1,v2){
    	console.log("\n~~ css done ~~".bold.green)
    })
}

gulp.task('sass',runsass);
runsass()
gulp.watch('./client_source/style/**/*.scss', ['sass']);


module.exports = cfg;