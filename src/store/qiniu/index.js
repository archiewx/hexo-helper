import * as types from './types'
import createReducer from '../createReducer'

const state = {
  buckets: [],
  uploadToken: '',
  fileListData: {
    list: [],
    marker: '',
    total: 0,
    lastTime: ''
  }
}

export default createReducer(state, {
  [types.REQUEST_BUCKETS](state, action) {
    const buckets = action.buckets || []
    return { ...state, buckets }
  },
  [types.REQUEST_UPLOAD_TOKEN](state, action) {
    return { ...state, uploadToken: action.token }
  },
  [types.REUQEST_FILE_LIST](state, action) {
    const { fileList, marker, total, lastTime } = action
    return { ...state, fileListData: { list: fileList, marker, total, lastTime } }
  }
})
