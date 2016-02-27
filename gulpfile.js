'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
// gulp.task('sass', function () {
//   return gulp.src('./client_source/style/main.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./client_static'));
// });
 
gulp.task('default', function () {
	gulp.src('./client_source/style/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client_static'));
  gulp.watch('./client_source/style/**/*.scss', ['sass']);
});