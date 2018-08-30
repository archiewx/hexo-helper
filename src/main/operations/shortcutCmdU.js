const electron = require('electron')
const Notification = electron.Notification
const mainProcess = require('../utils/mainProcessConf')
const clipboard = electron.clipboard
const axios = require('axios')
const notification = require('../utils/mainNotification')
const uploadFormatter = require('../utils/uploadFormatter')

const providerNames = ['qiniu', 'oss']

module.exports = function() {
  // 得到默认的服务商
  const config = mainProcess.getConfig()
  const name = providerNames.find(name => config[name].isDefault)
  const defaultProvider = config[name]
  const buckets = defaultProvider.buckets
  if (!buckets.length) {
    notification.fail({
      title: '没有bucket',
      body: '请刷新bucket列表后，重新使用快捷键command+u上传'
    })
    return
  }
  const defaultBucket = buckets.find(b => b.isDefault)
  if (!defaultBucket) {
    const notice = new Notification({
      title: '未设置默认bucket',
      subtitle: '工具不知道将文件上传到什么地方，请进入设置 -> 选择设置bucket -> 选择默认的bucket'
    })
    notice.show()
    return
  }
  const nativeImage = clipboard.readImage()
  if ((nativeImage.constructor && nativeImage.constructor.name) === 'NativeImage') {
    const now = Date.now()
    const prefix = defaultProvider.prefix
    const filename = `${now}.jpeg`
    const key = `${prefix}/${filename}`
    const image = nativeImage.toJPEG(100)
    // 写入文件
    axios
      .get('/qiniu/signature', {
        params: {
          bucket: defaultBucket.name,
          key
        }
      })
      .then(res => (res.status === 200 ? res.data : {}))
      .then(res => {
        const token = res.data.token
        const boundary = parseInt(Math.random() * Number.MAX_SAFE_INTEGER, 10).toString(16)
        const params = { token, key }
        const postData = uploadFormatter(params, {
          filename: key,
          file: image,
          boundary
        })
        return axios({
          url: defaultBucket.area.web,
          method: 'POST',
          data: postData,
          headers: {
            'Content-Type': 'multipart/form-data;boundary=' + boundary
          }
        })
      })
      .then(() => {
        const url = `http://${defaultBucket.domain}/${key}`
        clipboard.writeText(url)
        const notice = new Notification({
          title: '上传成功',
          subtitle: '已复制到粘贴板上'
        })
        notice.show()
      })
      .catch(err => {
        notification.fail({
          title: '上传失败了',
          body: err.message
        })
      })
  }
}
