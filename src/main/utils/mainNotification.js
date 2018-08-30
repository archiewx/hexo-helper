const electron = require('electron')
const path = require('path')

const Notification = electron.Notification
const nativeImage = electron.nativeImage
const okImage = nativeImage.createFromPath(
  path.resolve(__dirname, '../../src/assets/icons8-ok.png')
)
const failImage = nativeImage.createFromPath(
  path.resolve(__dirname, '../../src/assets/icons8-cancel.png')
)

module.exports = {
  success(options) {
    const notification = new Notification({
      title: options.title || '成功',
      subtitle: options.subtitle || new Date().toLocaleString(),
      body: options.body || '已经操作成功',
      icon: okImage
    })
    notification.show()
  },
  fail(options) {
    const notification = new Notification({
      title: options.title || '失败了',
      subtitle: options.subtitle || new Date().toLocaleString(),
      body: options.body || '失败',
      icon: failImage
    })
    notification.show()
  }
}
