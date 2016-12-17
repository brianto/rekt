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
      'app/tests/unit/**/*.spec.js',
    ],

    frameworks: [
      'mocha',
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

    htmlReporter: {
      outputFile: 'dist/unit-tests/index.html',
      groupSuites: true,
      useCompactStyle: true,
    },

    coverageReporter: {
      dir: 'dist',
      subdir: 'unit-coverage',
      reporters: [
        { type: 'text', file: 'coverage.txt' },
      ],
    },

  });
}
