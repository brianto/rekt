const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
  },
  resolve: {
    modulesDirectories: [ 'bower_components' ],
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
        loader : 'babel',
      },
      {
        test: /.js$/,
        loader : 'imports',
        query: {
          'zepto': 'zepto',
        }
      },
    ],
  },
  plugins: [
    // Expose process.env vars to config.js
    new webpack.DefinePlugin({
      REKT_API_GATEWAY_ENDPOINT: JSON.stringify(process.env.REKT_API_GATEWAY_ENDPOINT || 'http://localhost:7000'),
    }),

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
