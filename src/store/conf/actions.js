import * as types from './types'
import electron from 'electron'
import axios from 'axios'

const remote = electron.remote
const mainConfig = remote.require('./main/utils/mainProcessConf')
const providerNames = ['qiniu', 'oss']

export function setOssSecretKey(type, accessKey, secretKey) {
  return dispatch => {
    let config = mainConfig.getConfig()
    config[type].accessKey = accessKey
    config[type].secretKey = secretKey
    mainConfig.setConfig(config)
    dispatch({
      type: types.SET_SECRET_KEY,
      config
    })
  }
}

export function readDefaultOss() {
  return dispatch => {
    const config = mainConfig.getConfig()
    const name = providerNames.find(n => config[n].isDefault)
    const defaultProvider = config[name]
    dispatch({
      type: types.READ_DEFAULT_OSS,
      defaultOss: defaultProvider
    })
  }
}

export function setDefaultOss(type) {
  return dispatch => {
    const config = mainConfig.setDefaultOss(type)
    dispatch({
      type: types.SET_DEFAULT_OSS,
      config
    })
  }
}

export function readBucket(type, name) {
  return dispatch => {
    const bucket = mainConfig.getBucket(type, name)
    dispatch({
      type: types.READ_BUCKET,
      bucket
    })
  }
}

function writeBucket(buckets) {
  return {
    type: types.WRITE_BUCKET,
    buckets
  }
}

export function writeBucketAsync(type, bucket) {
  return dispatch => {
    mainConfig.editBucket(type, bucket)
    const buckets = mainConfig.getBuckets(type)
    dispatch(writeBucket(buckets))
  }
}

function readConfig() {
  const config = mainConfig.getConfig()
  return dispatch =>
    dispatch({
      type: types.READ_CONFIG,
      success: true,
      config
    })
}

export function readConfigAsync() {
  return dispatch => {
    return dispatch(readConfig())
  }
}

function readDefaultBucket(bucket) {
  return {
    type: types.READ_DEFAULT_BUCKET,
    bucket
  }
}

export function readDefaultBucketAsync() {
  return dispatch => {
    const config = mainConfig.getConfig()
    const name = providerNames.find(n => config[n].isDefault)
    const defaultProviders = config[name]
    const buckets = defaultProviders.buckets
    const defaultBucket = buckets.find(cv => cv.isDefault)
    return dispatch(readDefaultBucket(defaultBucket))
  }
}

function writeConfig(writeStatus) {
  return {
    type: types.WRITE_CONFIG,
    writeStatus
  }
}

export function writeConfigAsync(config) {
  return dispatch => {
    try {
      mainConfig.setConfig(config)
      return dispatch(writeConfig(true))
    } catch (err) {
      return dispatch => dispatch(writeConfig(false))
    }
  }
}

export function readConfigBuckets(readStatus, buckets) {
  return {
    type: types.READ_CONFIG_BUCKETS,
    readStatus,
    buckets
  }
}

export function readConfigBucketsAsync() {
  return dispatch => {
    try {
      const config = mainConfig.getConfig()
      const name = providerNames.find(n => config[n].isDefault)
      const defaultProviders = config[name]
      const buckets = defaultProviders.buckets
      return dispatch(readConfigBuckets(true, buckets))
    } catch (err) {
      return dispatch(readConfigBuckets(false))
    }
  }
}

function writeConfigBuckets(writeStatus, buckets) {
  return {
    type: types.WRITE_CONFIG_BUCKETS,
    writeStatus,
    buckets
  }
}

export function writeConfigBucketsAsync(type, buckets) {
  return dispatch => {
    try {
      mainConfig.setBuckets(type, buckets)
      return dispatch(writeConfigBuckets(true, buckets))
    } catch (err) {
      return dispatch(writeConfigBuckets(false))
    }
  }
}

// 获取管理签证
function fetchManage(data) {
  return dispatch =>
    dispatch({
      type: types.GET_MANAGE_TOKEN,
      data
    })
}

export function fetchManageAsync(secretKey, accessKey, path, query = {}) {
  return dispatch => {
    return axios
      .get('/qiniu/signature', {
        params: {
          type: 'manage',
          secretKey,
          accessKey,
          path,
          query
        }
      })
      .then(res => (res.status === 200 ? res.data : {}))
      .then(res => {
        return dispatch(fetchManage(res.data))
      })
  }
}
