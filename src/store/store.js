import Vuex from 'vuex';
import modules from './modules';
import formatModules from './formatModules';

const store = {};

/* 创建store */
export function storeFactory(initialState = {}) {
  if (!store.value) {
    store.value = new Vuex.Store({
      state: initialState,
      getters: {
        getInitialStateData: (state) => (key) => state[key]
      },
      modules: formatModules(modules, initialState)
    });
  }

  return store.value;
}

export default store;