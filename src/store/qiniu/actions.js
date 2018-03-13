import * as types from './types'
import axios from 'axios'
import electron from 'electron'

const remote = electron.remote
const mainConfig = remote.require('./main/utils/mainProcessConf')
const providerNames = ['qiniu', 'oss']

function requestFileList(data) {
  return {
    type: types.REUQEST_FILE_LIST,
    marker: data.marker,
    fileList: data.items,
    total: data.total,
    lastTime: data.lastTime
  }
}

export function requestFileAsync(bucket, zone, options = {}) {
  const config = mainConfig.getConfig()
  const name = providerNames.find(n => config[n].isDefault)
  const defaultProvider = config[name]
  const secretKey = defaultProvider.secretKey
  const accessKey = defaultProvider.accessKey
  options.limit = 9
  // options.prefix = defaultProvider.prefix
  return dispatch => {
    return axios
      .post('/qiniu/file-list', {
        accessKey,
        secretKey,
        bucket,
        options,
        zone
      })
      .then(res => (res.status === 200 ? res.data : {}))
      .then(res => {
        if (res.success) {
          dispatch(requestFileList(res.data))
        }
      })
  }
}

function requestUploadToken(data) {
  return {
    type: types.REQUEST_UPLOAD_TOKEN,
    token: data.token
  }
}

export function requestUploadTokenAsync(ak, sk, key, bucket) {
  return dispatch => {
    return axios
      .get('/qiniu/signature', {
        params: {
          accessKey: ak,
          secretKey: sk,
          key,
          bucket
        }
      })
      .then(res => (res.status === 200 ? res.data : {}))
      .then(res => {
        return dispatch(requestUploadToken(res.data))
      })
  }
}

function requestBuckets(data) {
  return {
    buckets: data.buckets,
    type: types.REQUEST_BUCKETS
  }
}

export function requestBucketsAsync(ak, sk) {
  return dispatch =>
    axios
      .get('/qiniu/buckets', {
        params: {
          accessKey: ak,
          secretKey: sk
        }
      })
      .then(res => (res.status === 200 ? res.data : {}))
      .then(res => {
        return dispatch(requestBuckets(res.data))
      })
}
