/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-08-30 11:11:20
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-08-30 11:22:15
 */
// process.env.NODE_ENV = 'development'

require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension
    .default(installExtension.REACT_DEVELOPER_TOOLS)
    .then(() => {})
    .catch(err => {
      // eslint-disable-next-line
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

require('./main')
