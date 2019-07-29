export default {
  namespaced: true,
  state: {
    text: 'page'
  },
  getters: {
    getText: (state) => () => state.text
  }
};