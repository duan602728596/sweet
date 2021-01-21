import Vuex from 'vuex';
import modules from './modules';
import formatModules from './formatModules';

export let store;

/* 创建store */
export function storeFactory(initialState = {}) {
  // store.replaceState
  if (!store) {
    store = new Vuex.Store({
      state: initialState,
      getters: {
        getInitialStateData: (state) => (key) => state[key]
      },
      modules: formatModules(modules, initialState)
    });
  }

  return store;
}