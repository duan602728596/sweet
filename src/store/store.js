import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

const store = {};

export function storeFactory(initialState = {}) {
  /* store */
  Object.assign(store, new Vuex.Store({
    state: initialState,
    getters: {
      getInitialStateData: (state) => (key) => state[key]
    },
    modules
  }));

  return store;
}

export default store;