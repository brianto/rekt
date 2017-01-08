const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
  },
  resolve: {
    modulesDirectories: [ 'bower_components' ],
  },
  loader: {
    configEnvironment: process.env.NODE_ENV || 'development',
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
        loader : 'babel',
      },
      {
        test: /\/config\.js$/,
        loader : 'webpack-config',
      },
      {
        test: /.js$/,
        loader : 'imports',
        exclude: /\/config\.js$/,
        query: {
          'zepto': 'zepto',
        }
      },
    ],
  },
  plugins: [
    // Make Bower work
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', [ 'main' ])),

    // Uglify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
