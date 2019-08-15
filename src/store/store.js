import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import formatModules from './formatModules';

Vue.use(Vuex);

const store = {
  store: null
};

export function storeFactory(initialState = {}) {
  store.store = new Vuex.Store({
    state: initialState,
    getters: {
      getInitialStateData: (state) => (key) => state[key]
    },
    modules: formatModules(modules, initialState)
  });

  return store.store;
}

export default store;