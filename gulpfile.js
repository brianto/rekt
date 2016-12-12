const gulp = require('gulp');
const del = require('del');
const path = require('path');

const bower = require('bower-files')();
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const dynamo = require('dynamodb-local');
const handlebars = require('gulp-compile-handlebars');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const named = require('vinyl-named');
const open = require('open');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const webserver = require('gulp-webserver');

const config = {
  node: require('./package.json'),
  bower: require('./bower.json'),
};

const DIST_DIR = 'dist'
const SRC_DIR = 'app';

gulp.task('clean', () => {
  return del([ DIST_DIR ]);
});

gulp.task('bower:css', () => {
  return gulp
  .src(bower.ext('css').files)
  .pipe(sourcemaps.init())
  .pipe(cleancss())
  .pipe(concat('vendor.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(DIST_DIR, 'app', 'css')))
  ;
});

gulp.task('bower:fonts', () => {
  return gulp
  .src(bower.ext([ 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2' ]).files)
  .pipe(gulp.dest(path.join(DIST_DIR, 'app', 'fonts')))
  ;
})

gulp.task('bower', [
  'bower:css',
  'bower:fonts',
]);

gulp.task('app:html', () => {
  return gulp
  .src(path.join(SRC_DIR, '*.html.hbs'))
  .pipe(handlebars({
    config: config,
  }, {
    batch: [ path.join(SRC_DIR, 'tmpl') ],
  }))
  .pipe(htmlmin({
    html5: true,
    collapseWhitespace: true,
    removeComments: true,
  }))
  .pipe(rename(path => path.extname = ''))
  .pipe(gulp.dest(path.join(DIST_DIR, 'app')))
  ;
});

gulp.task('app:css', () => {
  return gulp
  .src(path.join(SRC_DIR, '*.less'))
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(cleancss())
  .pipe(concat('style.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(DIST_DIR, 'app', 'css')))
  ;
});

gulp.task('app:js', () => {
  return gulp
  .src(path.join(SRC_DIR, '*.js'))
  .pipe(named())
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest(path.join(DIST_DIR, 'app', 'js')))
  ;
});

gulp.task('app', [
  'app:html',
  'app:css',
  'app:js',
]);

gulp.task('server', () => {
  gulp.watch(path.join(SRC_DIR, '**', '*.html.hbs'), [ 'app:html' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.less'), [ 'app:css' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.js'), [ 'app:js' ]);

  return gulp
  .src(path.join(DIST_DIR, 'app'))
  .pipe(webserver({
    livereload: true,
  }))
  ;
});

gulp.task('default', [ 'bower', 'app' ]);

gulp.task('dynamodb', () => {
  const PORT = 4567;

  dynamo.launch(PORT, null, [ '-sharedDb' ]);

  // Launch resolving the promise doesn't guarantee the local dynamodb service
  // will be running. 1s wait is close enough.
  setTimeout(() => open(`http://localhost:${PORT}/shell`), 1000);
});
