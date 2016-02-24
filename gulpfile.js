/**
 * Javascript Task Runner
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var gulp = require('gulp');

var closureCompiler = require('google-closure-compiler').gulp();
var cssnano = require('gulp-cssnano');
var gjslint = require('gulp-gjslint');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

gulp.task('default', ['js-lint', 'js-compile', 'less']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('js-lint', function() {
  return gulp.src(['./shared/*.js',
                   './static/js/game/*.js',
                   './static/js/*.js'])
    .pipe(gjslint({
      flags: ['--jslint_error indentation',
              '--jslint_error well_formed_author',
              '--jslint_error braces_around_type',
              '--jslint_error unused_private_members',
              '--jsdoc',
              '--max_line_length 80',
              '--error_trace'
             ]
    }))
    .pipe(gjslint.reporter('console'));
});

gulp.task('js-compile', function() {
  return gulp.src(['./shared/*.js',
                   './static/js/game/*.js',
                   './static/js/*.js'])
    .pipe(plumber())
    .pipe(closureCompiler({
      warning_level: 'VERBOSE',
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      js_output_file: 'minified.js'
    }))
    .pipe(gulp.dest('./static/dist'));
});

gulp.task('less', function() {
  return gulp.src('./static/less/styles.less')
    .pipe(plumber())
    .pipe(less({ compress: true}))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename(function(path) {
      path.basename = 'minified';
      path.extname = '.css';
    }))
    .pipe(gulp.dest('./static/dist'));
});

gulp.task('watch-js', function() {
  gulp.watch(['./shared/*.js',
              './static/js/*.js',
              './static/js/game/*.js'], ['js-compile']);
});

gulp.task('watch-less', function() {
  gulp.watch('./static/less/*.less', ['less']);
});

gulp.task('watch', function() {
  gulp.watch(['./shared/*.js',
              './static/js/*.js',
              './static/js/game/*.js'], ['js-compile']);
  gulp.watch('./static/less/*.less', ['less']);
});
