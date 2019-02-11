// @flow
import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

const store: Vuex.Store = {};

export function storeFactory(initialState: Object = {}): Vuex.Store{
  /* store */
  Object.assign(store, new Vuex.Store({
    state: initialState,
    getters: {
      getInitialStateData: (state: Object): Function => (key: string): number => state[key]
    },
    modules
  }));

  return store;
}

export default store;