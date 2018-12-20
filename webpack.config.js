const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  watch: isDevelopment,
  devtool: isDevelopment ? 'source-map' : false,
  entry: {
    app: isDevelopment
      ? ['babel-polyfill', path.join(__dirname, 'src', 'index.jsx')]
      : path.join(__dirname, 'src', 'index.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'crowdsorcerer',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s{0,1}css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader']),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        TMC_TOKEN: JSON.stringify(process.env.TMCTOKEN || 'development'),
      },
    }),
    new ExtractTextPlugin('[name].css'),
    isDevelopment ? null : new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ].filter(p => !!p),
  devServer: {
    port: 51433,
  },
};
