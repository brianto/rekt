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
const yaml = require('gulp-yaml');
const zip = require('gulp-zip');

const config = {
  node: require('./package.json'),
  bower: require('./bower.json'),
};

const LOCALDEV_SERVER_PORT = 8000;

const SRC_DIR = 'app';
const API_DIR = 'api';
const AWS_LAMBDA_API_GATEWAY_ZIP = 'lambda-api-gateway.zip';

const DIST_DIR = 'dist';
const DIST_SITE_DIR = path.join(DIST_DIR, 'site');
const DIST_LOCALDEV_DIR = path.join(DIST_DIR, 'localdev');
const DIST_AWS_DIR = path.join(DIST_DIR, 'aws');

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
  .pipe(webpack(require('./browser.webpack.config.js')))
  .pipe(gulp.dest(path.join(DIST_SITE_DIR, 'js')))
  ;
});

gulp.task('api:definition', () => {
  function environment(key, defaultValue) {
    const value = process.env[key];
    return value == null ? defaultValue : value;
  }

  function apiGatewayUriFor(lambdaArn) {
    const region = environment('AWS_REGION', 'xx-localdev-1');
    const path = [ 'path', '2015-03-31', 'functions', lambdaArn, 'invocations' ].join('/');
    return [ 'arn', 'aws', 'apigateway', region , 'lambda', path ].join(':');
  }

  return gulp
  .src(path.join(API_DIR, '*.yml.hbs'))
  .pipe(handlebars({
    Name: environment('REKT_API_NAME', 'Rekt'),
    Endpoint: environment('REKT_API_GATEWAY_ENDPOINT', `localhost:${LOCALDEV_SERVER_PORT}`),
    Stage: environment('REKT_API_GATEWAY_STAGE', ''),
    ServicerArn: environment('REKT_SERVICER_ARN', 'localdev-servicer'),
    CreateReviewLambdaUri: apiGatewayUriFor(environment('REKT_CREATE_REVIEW_LAMBDA_ARN', 'localdev-create-review')),
  }, {
    compile: {
      strict: true,
    }
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

gulp.task('api:functions', () => {
  return gulp
  .src([
    path.join(API_DIR, 'aws', '**', '*.js'),
    path.join('!**', '*.spec.js'),
  ])
  .pipe(named())
  .pipe(webpack(require('./aws-lambda.webpack.config.js')))
  .pipe(zip(AWS_LAMBDA_API_GATEWAY_ZIP))
  .pipe(gulp.dest(DIST_AWS_DIR))
  ;
});

gulp.task('build', [
  'bower:css',
  'bower:fonts',
  'app:html',
  'app:css',
  'app:js',
  'api:definition',
  'api:functions',
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
    path.join(API_DIR, 'aws', '**', '*.js'),
    path.join(API_DIR, 'localdev', '**', '*.js'),
    path.join('!**', '*.spec.js'),
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
  gulp.watch(path.join(SRC_DIR, '**', '*.html.hbs'), [ 'app:html' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.less'), [ 'app:css' ]);
  gulp.watch(path.join(SRC_DIR, '**', '*.js'), [ 'app:js' ]);

  gulp.watch(path.join(API_DIR, '*.yml.hbs'), [ 'api:definition' ]);

  gulp.watch(path.join(API_DIR, 'localdev', '*.yml'), [ 'localdev:assets' ]);
  gulp.watch([
    'localdev.js',
    path.join(API_DIR, '**', '*.js'),
    path.join('!**', '*.spec.js'),
  ], [ 'localdev:compile' ]);

  return gls.new([
    path.join(DIST_LOCALDEV_DIR, 'localdev.js'),
    `--server-port=${LOCALDEV_SERVER_PORT}`,
  ])
  .start();
});

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

gulp.task('default', [ 'build', 'localdev' ]);

