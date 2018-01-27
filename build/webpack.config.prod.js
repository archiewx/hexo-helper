const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: './dist',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(css)|(scss)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),
    new CleanWebpackPlugin(
      [path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../index.html')],
      {
        root: path.resolve(__dirname, '../')
      }
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/templates/index.html'),
      chunks: ['vendor', 'manifest', 'renderer'],
      filename: path.resolve(__dirname, '../index.html')
    })
  ]
})
