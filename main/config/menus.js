// 菜单
const electron = require('electron')
const app = electron.app
const webContents = electron.webContents
// const setting = require('../windows/settings')
const isDev = process.env.NODE_ENV === 'development'

const menuTemp = []
if (isDev) {
  menuTemp.push({
    label: '开发者',
    submenu: [
      {
        label: 'dev',
        role: 'toggledevtools'
      }
    ]
  })
}
menuTemp.push({
  label: '编辑',
  submenu: [
    { role: 'undo', label: '撤销' },
    { role: 'redo', label: '恢复' },
    { type: 'separator' },
    { role: 'cut', label: '剪切' },
    { role: 'copy', label: '复制' },
    { role: 'paste', label: '粘贴' },
    { role: 'delete', label: '删除' },
    { role: 'selectall', label: '选择所有' }
  ]
})

menuTemp.push({
  label: '帮助',
  role: 'help',
  submenu: [
    {
      label: '联系我',
      click() {
        electron.shell.openExternal('mailto:zhenglfsir@gmail.com')
      }
    }
  ]
})

if (process.platform === 'darwin') {
  menuTemp.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about', label: '关于' },
      { type: 'separator' },
      {
        label: '设置',
        click() {
          const web = webContents.getFocusedWebContents()
          web.send('navigate', { pathname: '/settings' })
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
