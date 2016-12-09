const gulp = require('gulp');
const del = require('del');

const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');

const BUILD_DIR = 'build';

gulp.task('clean', function() {
  return del([ 'build' ]);
});

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

gulp.task('default', [ 'build' ]);
