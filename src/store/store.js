import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import formatModules from './formatModules';

Vue.use(Vuex);

const store = {};

export function storeFactory(initialState = {}) {
  if (Object.keys(store).length === 0) {
    Object.assign(store, new Vuex.Store({
      state: initialState,
      getters: {
        getInitialStateData: (state) => (key) => state[key]
      },
      modules: formatModules(modules, initialState)
    }));
  }

  return store;
}

export default store;