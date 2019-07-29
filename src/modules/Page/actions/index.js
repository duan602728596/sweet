export default {
  namespaced: true,
  state: {
    text: 'async page'
  },
  getters: {
    getText: (state) => () => state.text
  }
};