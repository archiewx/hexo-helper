const notification = require('../utils/mainNotification')
const shortcutCmdU = require('./shortcutCmdU')
const openDialog = require('./openFileDialog')

function registerShortcutFail(key) {
  notification.fail({
    title: '快捷键失效',
    body: `您的MACOS使用了和本软件冲入的${key}的快捷键`
  })
}

module.exports = globalShortcut => {
  const CmdURet = globalShortcut.register('Command+U', shortcutCmdU)
  if (!CmdURet) {
    registerShortcutFail('Command+U')
  }
  const CmdORet = globalShortcut.register('Command+O', openDialog)
  if (!CmdORet) {
    registerShortcutFail('Command+O')
  }
}
