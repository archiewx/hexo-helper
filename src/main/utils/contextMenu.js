// 状态栏菜单开发
const electron = require('electron')
const path = require('path')
const Menu = electron.Menu

module.exports = function() {
  let appNativeImage = new electron.nativeImage.createFromPath(
    path.resolve(__dirname, '../../logo.png')
  )
  appNativeImage = appNativeImage.resize({ width: 40 })
  const appIcon = new electron.Tray(appNativeImage)
  if (process.env.NODE_ENV === 'development') {
    appIcon.on('click', click)
    appIcon.on('right-click', rightClick)
    appIcon.on('drop-files', dropFiles)
    // 创建菜单栏菜单
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示', type: 'radio', click: showMenu },
      { label: '关闭功能', type: 'radio', click: closeFunc },
      { label: '开启功能', type: 'radio', click: openFunc }
    ])
    appIcon.setTitle('HexO')
    appIcon.setContextMenu(contextMenu)
  }

  return appIcon
}

function click(e) {
  console.log(e)
}

function rightClick(e, bounds) {
  console.log(e, bounds)
}

function dropFiles(e, files) {
  console.log(e, files)
}

function showMenu(e) {
  console.log('show', e)
}

function closeFunc(e) {
  console.log('close', e)
}

function openFunc(e) {
  console.log('open', e)
}
