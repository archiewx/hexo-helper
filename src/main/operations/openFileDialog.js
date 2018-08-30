const electron = require('electron')
const webContents = electron.webContents
const dialog = electron.dialog

module.exports = () => {
  const currentWindow = webContents.getFocusedWebContents()
  dialog.showOpenDialog(currentWindow, {
    title: '选择自动清理目录'
  })
}
