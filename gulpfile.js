const gulp = require('gulp');
const del = require('del');
const path = require('path');

const bower = require('bower-files')({
  overrides: {
    'font-awesome': {
      main: [
        'css/font-awesome.css',
        'fonts/*',
      ],
    },
    pure: {
      main: 'src/**/*.css',
    },
    lodash: {
      main: 'lodash.js',
    },
  },
});

const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');

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

gulp.task('bower:css', function() {
  return gulp
  .src(bower.ext('css').files)
  .pipe(sourcemaps.init())
  .pipe(cleancss())
  .pipe(concat('vendor.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(BUILD_DIR, 'css')))
  ;
});

gulp.task('bower:fonts', function() {
  return gulp
  .src(bower.ext([ 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2' ]).files)
  .pipe(gulp.dest(path.join(BUILD_DIR, 'fonts')))
  ;
})

gulp.task('bower', [
  'bower:js',
  'bower:css',
  'bower:fonts',
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

gulp.task('server', [ 'build' ], function() {
  gulp.watch('app/**/*', [ 'build' ]);

  return gulp
  .src(BUILD_DIR)
  .pipe(webserver({
    livereload: true,
  }))
  ;
});

gulp.task('default', [ 'bower', 'build' ]);
