const path = require('path');

const DIST_DIR = path.join('dist', 'site');

var webpack = require('./browser.webpack.config.js');
webpack.module.preLoaders = [
  {
    test: /\.js$/,
    include: path.resolve('app/lib/'),
    loader: 'babel-istanbul',
  },
];

module.exports = config => {
  config.set({
    browsers: [ 'PhantomJS' ],
    autoWatch: false,
    singleRun: true,
    failOnEmptyTestSuite: false,

    files: [
      // ...because es6 ...and phantom
      // https://kangax.github.io/compat-table/es6/#phantom
      // https://github.com/babel/karma-babel-preprocessor#polyfill
      'node_modules/babel-polyfill/dist/polyfill.js',

      'app/tests/unit/**/*.spec.js',
    ],

    frameworks: [
      'mocha',
      'chai-as-promised',
      'sinon-chai',
      'chai',
      'sinon',
    ],

    reporters: [
      'mocha',
      'html',
      'coverage',
    ],

    preprocessors: {
      'app/lib/**/*.js': [ 'webpack', 'babel' ],
      'app/tests/**/*.js': [ 'webpack', 'babel' ],
    },

    webpack: webpack,
    webpackMiddleware: {
      stats: 'minimal',
    },

    htmlReporter: {
      outputFile: path.join(DIST_DIR, 'unit-tests', 'index.html'),
      groupSuites: true,
      useCompactStyle: true,
    },

    coverageReporter: {
      dir: DIST_DIR,
      subdir: 'unit-coverage',
      reporters: [
        { type: 'html' },
      ],
    },

  });
}
