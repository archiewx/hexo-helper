const electron = require('electron')
const url = require('url')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let setWindow

function createWindow() {
  setWindow = new BrowserWindow({
    width: 400,
    height: 600,
    titleBarStyle: 'hidden',
    show: false,
    fullscreen: false
  })
  setWindow.loadURL(
    url.format({
      pathname: path.resolve(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )
  setWindow.webContents.openDevTools()
  setWindow.once('ready-to-show', () => {
    // 加载完成后再显示
    setWindow.show()
  })
  setWindow.on('closed', function() {
    setWindow = null
  })
}

exports.createWindow = createWindow
