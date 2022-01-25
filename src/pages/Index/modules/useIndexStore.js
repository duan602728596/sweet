import { defineStore } from 'pinia';

const useStore = defineStore('index', {
  state: () => ({
    likeLen: 0
  }),
  getters: {
    getLikeLen: (state) => state.likeLen
  },
  actions: {
    setLikeLen(payload) {
      this.likeLen = payload;
    }
  }
});

export default useStore;