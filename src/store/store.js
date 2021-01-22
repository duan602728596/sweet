import Vuex from 'vuex';
import { modules } from './modules';

export let store;

/* 创建store */
export function storeFactory(initialState = {}) {
  if (!store) {
    store = new Vuex.Store({
      state: initialState,
      getters: {
        getInitialStateData: (state) => (key) => state[key]
      },
      modules
    });
  }

  return store;
}