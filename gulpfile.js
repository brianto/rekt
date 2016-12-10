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
    lodash: {
      main: 'lodash.js',
    },
  },
});

const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const handlebars = require('gulp-compile-handlebars');
const less = require('gulp-less');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');

const config = {
  node: require('./package.json'),
  bower: require('./bower.json'),
};

const BUILD_DIR = 'build';
const APP_DIR = 'app';

gulp.task('clean', () => {
  return del([ 'build' ]);
});

gulp.task('bower:js', () => {
  return gulp
  .src(bower.ext('js').files)
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(BUILD_DIR, 'js')))
  ;
});

gulp.task('bower:css', () => {
  return gulp
  .src(bower.ext('css').files)
  .pipe(sourcemaps.init())
  .pipe(cleancss())
  .pipe(concat('vendor.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(BUILD_DIR, 'css')))
  ;
});

gulp.task('bower:fonts', () => {
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

gulp.task('app:html', () => {
  return gulp
  .src(path.join(APP_DIR, '*.html.hbs'))
  .pipe(handlebars({
    config: config,
  }, {
    batch: [ path.join(APP_DIR, 'tmpl') ],
  }))
  .pipe(rename(path => path.extname = ''))
  .pipe(gulp.dest(BUILD_DIR))
  ;
});

gulp.task('app:css', () => {
  return gulp
  .src(path.join(APP_DIR, '*.less'))
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(cleancss())
  .pipe(concat('style.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(BUILD_DIR, 'css')))
  ;
});

gulp.task('app:js:main', () => {
  return gulp
  .src(path.join(APP_DIR, '*.js'))
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(BUILD_DIR, 'js')))
  ;
});

gulp.task('app:js:lib', () => {
  // TODO
});

gulp.task('app', [
  'app:html',
  'app:css',
  'app:js:main',
  'app:js:lib',
]);

gulp.task('server', () => {
  gulp.watch(path.join(APP_DIR, '**', '*.html.hbs'), [ 'app:html' ]);
  gulp.watch(path.join(APP_DIR, '*.less'), [ 'app:css' ]);
  gulp.watch(path.join(APP_DIR, '*.js'), [ 'app:js:main' ]);
  gulp.watch(path.join(APP_DIR, 'lib', '**', '*.js'), [ 'app:js:lib' ]);

  return gulp
  .src(BUILD_DIR)
  .pipe(webserver({
    livereload: true,
  }))
  ;
});

gulp.task('default', [ 'bower', 'app' ]);
