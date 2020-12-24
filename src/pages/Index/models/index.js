import { makeAutoObservable } from 'mobx';

class Index {
  likeLen = 0;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  ssrInit() {
    if (typeof window !== 'object') {
      const indexState = globalThis.__INITIAL_STATE__.index;

      this.setLikeLen(indexState.likeLen);
    }
  }

  setLikeLen(n) {
    this.likeLen = n;
  }
}

const indexStore = new Index();

export default indexStore;