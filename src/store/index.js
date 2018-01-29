import { combineReducers } from 'redux'
import upload from './upload'

const state = {}

function index(state = state) {
  return { ...state }
}

export default combineReducers({ 
  index,
  upload
})
