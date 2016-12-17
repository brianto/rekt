const gulp = require('gulp');
const del = require('del');
const path = require('path');

const bower = require('bower-files')();
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const documentation = require('gulp-documentation');
const dynamo = require('dynamodb-local');
const handlebars = require('gulp-compile-handlebars');
const htmlmin = require('gulp-htmlmin');
const karma = require('karma');
const less = require('gulp-less');
const mocha = require('gulp-mocha');
const named = require('vinyl-named');
const open = require('open');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const webserver = require('gulp-webserver');
const zip = require('gulp-zip');

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

gulp.task('app:zip', [
  'app:html',
  'app:css',
  'app:js',
], () => {
  return gulp
  .src(path.join(DIST_DIR, 'app', '**', '*'))
  .pipe(zip('app.zip'))
  .pipe(gulp.dest(DIST_DIR))
  ;
});

gulp.task('app', [
  'app:html',
  'app:css',
  'app:js',
  'app:zip',
]);

gulp.task('default', [ 'bower', 'app' ]);

gulp.task('doc:generate', () => {
  return gulp
  .src(path.join(SRC_DIR, '**', '*.js'))
  .pipe(documentation('html'))
  .pipe(gulp.dest(path.join(DIST_DIR, 'docs')))
  ;
});

gulp.task('doc:zip', [ 'doc:generate' ], () => {
  return gulp
  .src(path.join(DIST_DIR, 'docs', '**', '*'))
  .pipe(zip('docs.zip'))
  .pipe(gulp.dest(DIST_DIR))
  ;
});

gulp.task('doc', [ 'doc:generate', 'doc:zip' ]);

gulp.task('server:app', () => {
  gulp.watch(path.join(SRC_DIR, '**', '*.html.hbs'), [ 'app:html' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.less'), [ 'app:css' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.js'), [ 'app:js' ]);

  return gulp
  .src(path.join(DIST_DIR, 'app'))
  .pipe(webserver({
    livereload: true,
    open: true,
  }))
  ;
});

gulp.task('server:doc', () => {
  gulp.watch(path.join(SRC_DIR, '**', '*.js'), [ 'doc:generate' ]);

  return gulp
  .src(path.join(DIST_DIR, 'docs'))
  .pipe(webserver({ open: true }))
  ;
});

gulp.task('server', [ 'server:app' ]);

gulp.task('test:unit', done => {
  new karma.Server({
    configFile: path.join(__dirname, 'karma.config.js'),
  }, done).start();
});

gulp.task('test:chrome', done => {
  new karma.Server({
    configFile: path.join(__dirname, 'karma.config.js'),
    browsers: [ 'Chrome' ],
    autoWatch: true,
    singleRun: false,
  }, done).start();
});

gulp.task('test:e2e', () => {
  return gulp
  .src(path.join(SRC_DIR, 'tests', 'e2e', '**', '*.spec.js'))
  .pipe(mocha({
    compilers: {
      js: require('babel-core/register'),
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: path.join(DIST_DIR, 'e2e-tests'),
      reportName: 'index',
    },
  }))
  ;
});

gulp.task('test:zip', [ 'test:unit', 'test:e2e' ], () => {
  return gulp
  .src(path.join(DIST_DIR, '@(unit|e2e)-@(tests|coverage)', '**', '*'))
  .pipe(zip('tests.zip'))
  .pipe(gulp.dest(DIST_DIR))
  ;
});

gulp.task('test', [ 'test:unit', 'test:e2e', 'test:zip' ]);

gulp.task('dynamodb', () => {
  const PORT = 4567;

  dynamo.launch(PORT, null, [ '-sharedDb' ]);

  // Launch resolving the promise doesn't guarantee the local dynamodb service
  // will be running. 1s wait is close enough.
  setTimeout(() => open(`http://localhost:${PORT}/shell`), 1000);
});
