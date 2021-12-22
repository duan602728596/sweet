import Vuex from 'vuex';
import { modules } from './modules';

export let store;

function createStore(initialState) {
  store = new Vuex.Store({
    state: initialState,
    getters: {
      getInitialStateData: (state) => (key) => state[key]
    },
    modules
  });
}

/* 创建store */
export function storeFactory(initialState = {}) {
  if (!store) {
    createStore(initialState);
  }

  return store;
}