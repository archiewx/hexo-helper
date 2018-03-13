import { combineReducers } from 'redux'
import upload from './upload'
import conf from './conf'
import qiniu from './qiniu'
import createReducer from './createReducer'

const BASE_CONFIG = 'BASE_CONFIG'

const state = {
  isDev: process.env.NODE_ENV === 'development'
}

const base = createReducer(state, {
  [BASE_CONFIG](state) {
    return state
  }
})

export default combineReducers({
  upload,
  conf,
  qiniu,
  base
})
