const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssFlexBugsFixs = require('postcss-flexbugs-fixes')
const autoprefixer = require('autoprefixer')

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
    libraryTarget: 'umd'
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    publicPath: '/',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(css)|(scss)$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'sass-loader?souceMap',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssFlexBugsFixs,
                autoprefixer({
                  browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                  flexbox: 'no-2009'
                })
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/templates/index.html'),
      publicPath: '/',
      chunks: ['renderer']
    })
  ]
})
