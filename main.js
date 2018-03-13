const electron = require('electron')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const url = require('url')
const menuTemp = require('./main/config/menus')
const mainProcessConf = require('./main/utils/mainProcessConf')
const shortcutCmdU = require('./main/operations/ShortcutCmdU')
const contextMenu = require('./main/utils/contextMenu')
const notification = require('./main/utils/mainNotification')
// Module to control application life.
const app = electron.app
const Menu = electron.Menu
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut
const isDev = process.env.NODE_ENV === 'development'

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// const Notification = electron.Notification

// 得到用户目录
const homeDir = app.getPath('home')
let reactVersion = ''
let reactDevTools = ''
if (isDev) {
  reactVersion = fs.readdirSync(
    homeDir +
      '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/'
  )
  reactDevTools = `${homeDir}/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/${
    reactVersion[0]
  }`
}

app.setAboutPanelOptions({
  applicationName: 'hexo helper',
  applicationVersion: '0.0.1',
  copyright: 'zhenglfsir@gmail.com',
  credits: '2018',
  version: '1.10.1'
})
app.dock.bounce('critical')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let reactName
let appIcon

// 创建之前进行初始配置文件操作
mainProcessConf.boot()
axios.defaults.baseURL = isDev ? 'http://localhost:3000' : 'https://util.wangxdog.cn'

function createWindow() {
  // Create the browser window.
  const mainWindowOptions = {
    id: 'homeWindow',
    width: 400,
    height: 600,
    title: 'hexo上传',
    titleBarStyle: 'hidden',
    resizable: true,
    skipTaskbar: true,
    fullscreen: false,
    fullscreenable: false,
    backgroundColor: '#fff',
    show: false,
    webPreferences: {
      scrollBounce: true
    },
    icon: appIcon
  }
  mainWindow = new BrowserWindow(mainWindowOptions)

  // and load the index.html of the app.
  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : url.format({
          pathname: path.join(__dirname, '/index.html'),
          protocol: 'file:',
          slashes: true
        })
  )
  const menu = Menu.buildFromTemplate(menuTemp)
  Menu.setApplicationMenu(menu)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (process.env.NODE_ENV === 'development' && reactName) {
      BrowserWindow.removeDevToolsExtension(reactName)
    }
    mainWindow = null
  })
  mainWindow.once('ready-to-show', function() {
    mainWindow.show()
    if (process.env.NODE_ENV === 'development' && reactDevTools) {
      reactName = BrowserWindow.addDevToolsExtension(reactDevTools)
    }
  })
  // mainWindow.on('swipe', function(event, direction) {
  // ipcMain.emit()
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  // 使用快捷键自定义上传图片
  const ret = globalShortcut.register('Command+U', () => {
    // 使用快捷键上传
    shortcutCmdU()
  })
  if (!ret) {
    notification.fail({
      title: '快捷键失效',
      body: '您的MACOS使用了和本软件冲入的Command+U的快捷键'
    })
  }
  appIcon = contextMenu()
  createWindow()
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('uploading', function(event, percent) {
  if (mainWindow instanceof BrowserWindow) {
    mainWindow.setProgressBar(percent)
  }
})
ipcMain.on('upload-done', function() {
  if (mainWindow instanceof BrowserWindow) {
    mainWindow.setProgressBar(-1)
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
