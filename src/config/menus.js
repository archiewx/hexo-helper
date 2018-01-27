const app = require('electron').app
const setting = require('../windows/settings')
const menuTemp = [
  // {
  // label: '设置',
  // submenu: [
  // { role: 'undo' },
  // { role: 'redo' },
  // { type: 'separator' },
  // { role: 'cut' },
  // { role: 'copy' },
  // { role: 'paste' },
  // { role: 'pasteandmatchstyle' },
  // { role: 'delete' },
  // { role: 'selectall' }
  // ]
  // },
  // {
  //   label: 'View',
  //   submenu: [
  //     { role: 'reload' },
  //     { role: 'forcereload' },
  //     { role: 'toggledevtools' },
  //     { type: 'separator' },
  //     { role: 'resetzoom' },
  //     { role: 'zoomin' },
  //     { role: 'zoomout' },
  //     { type: 'separator' },
  //     { role: 'togglefullscreen' }
  //   ]
  // },
  // {
  //   role: 'window',
  //   submenu: [{ role: 'minimize' }, { role: 'close' }]
  // },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: '联系我',
        click() {
          require('electron').shell.openExternal('mailto:zhenglfsir@gmail.com')
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemp.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about', label: '关于' },
      { type: 'separator' },
      {
        label: '设置',
        click() {
          setting.createWindow()
        }
      },
      // { role: 'services', submenu: [] },
      // { type: 'separator' },
      // { role: 'hide' },
      // { role: 'hideothers' },
      // { role: 'unhide' },
      // { type: 'separator' },
      { role: 'quit', label: '退出' }
    ]
  })

  // Edit menu
  // menuTemp[1].submenu.push(
  //   { type: 'separator' },
  //   {
  //     label: 'Speech',
  //     submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
  //   }
  // )

  // Window menu
  // menuTemp[3].submenu = [
  //   { role: 'close' },
  //   { role: 'minimize' },
  //   { role: 'zoom' },
  //   { type: 'separator' },
  //   { role: 'front' }
  // ]
}

module.exports = menuTemp
