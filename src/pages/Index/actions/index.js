export default {
  namespaced: true,
  state: {
    likeLen: 0
  },
  getters: {
    getLikeLen: (state) => () => state.likeLen
  },
  mutations: {
    setLikeLen(state, payload) {
      state.likeLen = payload;
    }
  },
  actions: {
    setLikeLen(context, payload) {
      context.commit('setLikeLen', payload);
    }
  }
};