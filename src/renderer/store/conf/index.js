import createReducer from '../createReducer'
import * as types from './types'

const state = {
  config: {
    oss: null,
    qiniu: null
  },
  writeStatue: null,
  readStatus: null,
  buckets: [],
  defaultBucket: null,
  bucket: null,
  defaultOss: null
}

export default createReducer(state, {
  [types.READ_CONFIG](state, action) {
    return { ...state, config: { oss: action.config.oss, qiniu: action.config.qiniu } }
  },
  [types.GET_MANAGE_TOKEN](state, action) {
    return { ...state, mSign: action.data }
  },
  [types.WRITE_CONFIG](state, action) {
    if (!action.writeStatue) {
      return { ...state, writeStatue: action.writeStatue }
    }
    return { ...state, writeStatue: action.writeStatue, buckets: action.buckets }
  },
  [types.READ_CONFIG_BUCKETS](state, action) {
    return { ...state, readStatus: action.readStatus, buckets: action.buckets }
  },
  [types.READ_DEFAULT_BUCKET](state, action) {
    return { ...state, defaultBucket: action.bucket }
  },
  [types.WRITE_BUCKET](state, action) {
    return { ...state, buckets: action.buckets }
  },
  [types.READ_BUCKET](state, action) {
    return { ...state, bucket: action.bucket }
  },
  [types.SET_DEFAULT_OSS](state, action) {
    return {
      ...state,
      config: {
        qiniu: action.config.qiniu,
        oss: action.config.oss
      }
    }
  },
  [types.SET_DEFAULT_OSS](state, action) {
    return {
      ...state,
      config: {
        qiniu: action.config.qiniu,
        oss: action.config.oss
      }
    }
  },
  [types.READ_DEFAULT_OSS](state, action) {
    return {
      ...state,
      defaultOss: action.defaultOss
    }
  },
  [types.SET_SECRET_KEY](state, action) {
    return {
      ...state,
      config: {
        qiniu: action.config.qiniu,
        oss: action.config.oss
      }
    }
  }
})
