const electron = require('electron')
const menuTemp = require('./src/config/menus')
// Module to control application life.
const app = electron.app
const Menu = electron.Menu
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// const Notification = electron.Notification

const path = require('path')
const url = require('url')
// 得到用户目录
const homeDir = app.getPath('home')
const reactDevTools =
  homeDir +
  '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.2_0'
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

function createWindow() {
  // Create the browser window.
  const mainWindowOptions = {
    width: 400,
    height: 600,
    title: 'hexo资源神器',
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
    icon: path.resolve(__dirname, 'assets/btn.png')
  }
  mainWindow = new BrowserWindow(mainWindowOptions)

  // and load the index.html of the app.
  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080/index'
      : url.format({
          pathname: path.join(__dirname, 'index.html'),
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
    BrowserWindow.removeDevToolsExtension(reactName)
    mainWindow = null
  })
  mainWindow.once('ready-to-show', function() {
    mainWindow.show()
    reactName = BrowserWindow.addDevToolsExtension(reactDevTools)
  })
  mainWindow.on('swipe', function(event, direction) {
    ipcMain.emit()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  // 使用快捷键自定义上传图片
  const ret = globalShortcut.register('Command+U', () => {
    console.log('good')
  })
  if (!ret) {
    console.log('registration failed')
  }
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
  console.log(event, percent)
  if (mainWindow instanceof BrowserWindow) {
    mainWindow.setProgressBar(percent)
  }
})
ipcMain.on('upload-done', function(event) {
  if (mainWindow instanceof BrowserWindow) {
    mainWindow.setProgressBar(-1)
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
