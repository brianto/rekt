const path = require('path');

var webpack = require('./webpack.config.js');
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
      'chai',
      'sinon',
      'sinon-chai',
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
      outputFile: 'dist/unit-tests/index.html',
      groupSuites: true,
      useCompactStyle: true,
    },

    coverageReporter: {
      dir: 'dist',
      subdir: 'unit-coverage',
      reporters: [
        { type: 'html' },
      ],
    },

  });
}
