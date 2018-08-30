/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-08-29 20:59:07
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-08-29 23:02:13
 */
const path = require('path')

module.exports = exports = {
  arch: 'x64',
  asar: true,
  dir: path.join(__dirname, '../dist'),
  icon: path.join(__dirname, '../build/icons/icon'),
  ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))|\.gitkeep/,
  out: path.join(__dirname, '../build'),
  overwrite: true,
  platform: 'darwin',
}
