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
      'app/test/**/*.spec.js',
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
      'app/test/**/*.js': [ 'webpack', 'babel' ],
    },

    webpack: webpack,

    htmlReporter: {
      outputFile: 'dist/unit-test/index.html',
      groupSuites: true,
      useCompactStyle: true,
    },

    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'html', dir: 'dist', subdir: 'unit-coverage' },
      ],
    },

  });
}
