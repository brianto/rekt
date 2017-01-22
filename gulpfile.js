const gulp = require('gulp');
const del = require('del');
const path = require('path');

const babel = require('gulp-babel');
const bower = require('bower-files')();
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const documentation = require('gulp-documentation');
const dynamo = require('dynamodb-local');
const eslint = require('gulp-eslint');
const file = require('gulp-file');
const gls = require('gulp-live-server');
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
const yaml = require('gulp-yaml');

const config = {
  node: require('./package.json'),
  bower: require('./bower.json'),
};

const LOCALDEV_SERVER_PORT = 8000;

const SRC_DIR = 'app';
const API_DIR = 'api';

const DIST_DIR = 'dist';
const DIST_SITE_DIR = path.join(DIST_DIR, 'site');
const DIST_LOCALDEV_DIR = path.join(DIST_DIR, 'localdev');

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
  .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'css')))
  ;
});

gulp.task('bower:fonts', () => {
  return gulp
  .src(bower.ext([ 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2' ]).files)
  .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'fonts')))
  ;
})

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
  .pipe(gulp.dest(DIST_SITE_DIR))
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
  .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'css')))
  ;
});

gulp.task('app:js', () => {
  return gulp
  .src(path.join(SRC_DIR, '*.js'))
  .pipe(named())
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'js')))
  ;
});

gulp.task('api:compile', () => {
  return gulp
  .src(path.join(API_DIR, '*.yml.hbs'))
  .pipe(handlebars({
    host: process.env.REKT_API_GATEWAY_ENDPOINT || `localhost:${LOCALDEV_SERVER_PORT}`,
  }))
  .pipe(rename(path => path.extname = ''))
  .pipe(gulp.dest(DIST_SITE_DIR))
  .pipe(gulp.dest(DIST_LOCALDEV_DIR))
  .pipe(yaml({ safe: true }))
  .pipe(rename(path => path.extname = '.json'))
  .pipe(gulp.dest(DIST_SITE_DIR))
  .pipe(gulp.dest(DIST_LOCALDEV_DIR))
  ;
});

gulp.task('build', [
  'bower:css',
  'bower:fonts',
  'app:html',
  'app:css',
  'app:js',
  'api:compile',
]);

gulp.task('document:js', () => {
  return gulp
  .src(path.join(SRC_DIR, '**', '*.js'))
  .pipe(documentation('html'))
  .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'docs')))
  ;
});

gulp.task('document', [ 'document:js' ]);

gulp.task('localdev:compile', () => {
  return gulp
  .src([
    'localdev.js',
    path.join(API_DIR, 'localdev', '**', '*.js'),
  ])
  .pipe(babel())
  .pipe(gulp.dest(DIST_LOCALDEV_DIR))
  ;
});

gulp.task('localdev:assets', () => {
  return gulp
  .src(path.join(API_DIR, 'localdev', '*.yml'))
  .pipe(gulp.dest(DIST_LOCALDEV_DIR))
  ;
});

gulp.task('localdev', [
  'localdev:assets',
  'localdev:compile',
], () => {
  return gls.new([
    path.join(DIST_LOCALDEV_DIR, 'localdev.js'),
    `--server-port=${LOCALDEV_SERVER_PORT}`,
  ])
  .start();
});

gulp.task('server:app', [ 'server:localdev:storage' ], () => {
  gulp.watch(path.join(SRC_DIR, '**', '*.html.hbs'), [ 'app:html' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.less'), [ 'app:css' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.js'), [ 'app:js' ]);

  return gulp
  .src(DIST_SITE_DIR)
  .pipe(webserver({
    livereload: true,
    open: true,
  }))
  ;
});

gulp.task('server:localdev:storage', [ 'server:localdev:dynamodb' ], () => {
  const server = gls.new('localdev/storage.js');
  server.start();
});

gulp.task('server:localdev:dynamodb', () => {
  const PORT = 4567;
  dynamo.launch(PORT, null, [ '-sharedDb' ]);
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
      reportDir: path.join(DIST_SITE_DIR, 'e2e-tests'),
      reportName: 'index',
    },
  }))
  ;
});

gulp.task('test:lint', () => {
  return gulp
  .src([
    path.join(SRC_DIR, 'lib', '**', '*.js'),
    path.join(SRC_DIR, '*.js'),
  ])
  .pipe(eslint())
  .pipe(eslint.format('codeframe'))
  .pipe(eslint.format('html', result => {
    file('index.html', result, { src: true })
    .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'eslint')))
    ;
  }))
  .pipe(eslint.failAfterError())
  ;
});

gulp.task('test', [ 'test:unit', 'test:e2e', 'test:lint' ]);

gulp.task('default', [ 'build', 'server' ]);

gulp.task('dynamodb', () => {
  const PORT = 4567;

  dynamo.launch(PORT, null, [ '-sharedDb' ]);

  // Launch resolving the promise doesn't guarantee the local dynamodb service
  // will be running. 1s wait is close enough.
  setTimeout(() => open(`http://localhost:${PORT}/shell`), 1000);
});
