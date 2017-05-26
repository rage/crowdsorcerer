const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  watch: isDevelopment,
  devtool: 'eval-source-map',
  entry: {
    app: path.join(__dirname, 'src', 'index.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'random_widget',
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
      },
    }),
    new ExtractTextPlugin('[name].css'),
    isDevelopment ? null : new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:51433/',
    }),
  ].filter(p => !!p),
  devServer: {
    port: 51433,
  },
};
