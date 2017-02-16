import * as types from '../mutation-types'

const state = {
  compactMode: false
}

const mutations = {
  [types.TOGGLE_COMPACT_MODE] (state) {
    state.compactMode = !state.compactMode
  }
}

export default {
  state,
  mutations
}
