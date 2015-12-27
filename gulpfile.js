'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var uglify = require('gulp-uglify');
var reactify = require('reactify');
var sass = require('gulp-sass')
// add custom browserify options here
var customOpts = {
  entries: ['./src/main.js'],
  transform: [reactify/*,stringify(['.glsl'])*/],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('sass', function () {
  console.log('start sass');
  gulp.src('./src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/'));
});

// gulp.task('sass:watch', function () {
 
// });


gulp.task('default', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal



function bundle() {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(uglify())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public'));
}