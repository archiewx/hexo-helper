/**
 * 主进程配置文件读取
 */
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const app = electron.app
// const homeDir = app.getPath("home") // /Users/xxx
const appDataDir = app.getPath('userData') // /Users/xxx/Library/Application Support/hexo-helper
const filename = 'helper-dragon.json'
const appConfPath = appDataDir + '/' + filename
// const homeConfPath = homeDir + "/" + filename

// 启动创建配置文件
function boot() {
  // checkConfigFile()
  // todo:校验配置文件
}

function checkConfigFile() {
  const isExistConf = fs.existsSync(appConfPath)
  const helperConf = bufferToJson(
    fs.readFileSync(path.resolve(__dirname, '../config/helper-dragon.json'))
  )
  // 创建配置文件
  if (!isExistConf) {
    fs.writeFileSync(appConfPath, JSON.stringify(helperConf, null, 2))
    return
  }
  // 已存在的配置文件
  const existedConf = bufferToJson(fs.readFileSync(appConfPath))
  const oldVersion = existedConf.version
  // todo:相比版本 版本不同，则重新覆盖本地
  if (helperConf.version !== oldVersion) {
    fs.writeFileSync(appConfPath, JSON.stringify(helperConf, null, 2))
  }
}

function getConfig() {
  const data = JSON.parse(fs.readFileSync(appConfPath))
  return data
}

// 写入配置文件
function setConfig(data) {
  checkConfigFile()
  fs.writeFileSync(appConfPath, JSON.stringify(data, null, 2))
}

/**
 * 设置配置文件项
 * @param {string} type 取值qiniu或者oss
 * @param {string} key 配置具体项目
 * @param {string | object} value 配置项取值
 */
function setAttribute(type, key, value) {
  const config = getConfig()
  let typeObject = config[type]
  typeObject[key] = value
  setConfig(config)
}

function setBuckets(type, buckets) {
  const config = getConfig()
  config[type]['buckets'] = buckets
  setConfig(config)
}

function getBuckets(type) {
  const config = getConfig()
  return config[type].buckets
}

/**
 * 删除bucket
 * @param {string} type
 * @param {string} id
 */
function deleteBucket(type, name) {
  const config = getConfig()
  const buckets = config[type].buckets
  const index = buckets.findIndex(cv => cv.name === name)
  buckets.splice(index, 1)
  setConfig(config)
}

/**
 * 得到属性值
 * @param {string} type
 * @param {string} key
 */
function getAttribute(type, key) {
  const config = getConfig()
  return config[type][key]
}

/**
 * 清空属性值
 * @param {string} type
 * @param {string} key
 */
function clearAttribute(type, key) {
  const config = getConfig()
  config[type][key] = ''
  setConfig(config)
}

function bufferToJson(buffer) {
  return JSON.parse(buffer.toString())
}

/**
 * 修改bucket
 * @param {string} type
 * @param {object} bucket
 */
function editBucket(type, bucket) {
  const buckets = getBuckets(type)
  const index = buckets.findIndex(cv => cv.name === bucket.name)
  buckets[index] = bucket
  setBuckets(type, buckets)
}

/**
 * 得到单个bucket
 * @param {string} type
 * @param {string} name
 */
function getBucket(type, name) {
  const buckets = getBuckets(type)
  const bucket = buckets.find(cv => cv.name === name)
  return bucket
}

function setDefaultOss(type) {
  const config = getConfig()
  for (let attr in config) {
    if (typeof config[attr] === 'object') {
      config[attr]['isDefault'] = false
    }
  }
  config[type]['isDefault'] = true
  setConfig(config)
  return config
}

module.exports = {
  boot,
  getConfig,
  setConfig,
  setAttribute,
  getAttribute,
  clearAttribute,
  setBuckets,
  getBuckets,
  editBucket,
  getBucket,
  deleteBucket,
  setDefaultOss
}
