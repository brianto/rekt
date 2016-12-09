const gulp = require('gulp');
const del = require('del');
const path = require('path');

const bower = require('bower-files')();
const concat = require('gulp-concat');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const BUILD_DIR = 'build';

gulp.task('clean', function() {
  return del([ 'build' ]);
});

gulp.task('bower:js', function() {
  return gulp
  .src(bower.ext('js').files)
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(BUILD_DIR, 'js')))
  ;
});

gulp.task('bower', [
  'bower:js',
]);

gulp.task('build', function() {
  return gulp
  .src('app/*.hbs')
  .pipe(handlebars())
  .pipe(rename(function(path) {
    path.extname = '';
  }))
  .pipe(gulp.dest(BUILD_DIR))
  ;
});

gulp.task('default', [ 'bower', 'build' ]);
