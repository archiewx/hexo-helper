import createReducer from '../createReducer'
import { INIT_APP } from './actions'
const state = {}

const upload = createReducer(state, {
  [INIT_APP](state, action) {
    return {...state}
  }
})

export default upload
