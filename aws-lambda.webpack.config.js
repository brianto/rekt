module.exports = {
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    'aws-sdk',
  ],
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
        loader : 'babel',
      },
    ],
  },
};
