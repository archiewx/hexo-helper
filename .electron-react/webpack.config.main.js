/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-08-16 16:03:51
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-08-30 14:27:32
 */
const path = require('path')
const webpack = require('webpack')
const isDev = require('./isDev')

const useEslint = true

const mainConfig = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, '../src/main/main.js')
  },
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    path: path.join(__dirname, '../dist/electron')
  },
  externals: [],
  resolve: {
    extensions: ['.js', '.json']
  },
  target: 'electron-main',
  module: {
    rules: (useEslint
      ? [
          {
            test: /\.(js)$/,
            enforce: 'pre',
            exclude: /node_modules/
          }
        ]
      : []
    ).concat([
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ])
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()]
}

if (isDev()) {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `${path.join(__dirname, '../static')}`.replace(/\\/g, '\\\\')
    })
  )
} else {
  mainConfig.mode = 'production'
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  })
}

module.exports = exports = mainConfig
