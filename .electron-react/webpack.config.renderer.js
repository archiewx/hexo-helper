const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssFlexBugsFixs = require('postcss-flexbugs-fixes')
const autoprefixer = require('autoprefixer')
const isDev = require('./isDev')

const renderConfig = {
  mode: 'development',
  entry: {
    renderer: path.resolve(__dirname, '../src/renderer/main.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/electron'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, '../src/renderer')
    }
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(js)|(jsx)$/,
        exclude: [path.resolve(__dirname, '../node_modules')],
        loader: 'babel-loader'
      },
      {
        test: /\.(jpe?g)|(png)|(gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(css)|(scss)$/,
        use: [
          isDev() ? 'style-loader' : MiniCssExtractPlugin.loader,
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
  node: {
    __dirname: isDev(),
    __filename: isDev()
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/renderer/templates/index.html'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules:
        process.env.NODE_ENV !== 'production' ? path.resolve(__dirname, '../node_modules') : false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

if (!isDev()) {
  renderConfig.mode = 'production'
  renderConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
}

module.exports = exports = renderConfig
