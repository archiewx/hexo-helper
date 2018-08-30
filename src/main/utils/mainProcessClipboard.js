/**
 * 读取粘贴板
 */
const electron = require('electron')
const clipboard = electron.clipboard

function writeClipboardText(text) {
  clipboard.writeText(text)
}

module.exports = {
  writeClipboardText
}
