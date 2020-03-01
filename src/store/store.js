/* 全局的store */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { fromJS, Map } from 'immutable';
import { createReducer } from './reducers';

/* reducer列表 */
const reducer = createReducer({});

/* 中间件 */
const middleware = applyMiddleware(thunk);

/* store */
const store = {
  asyncReducers: {}
};

export function storeFactory(initialState = {}) {
  /* initialState */
  const state = fromJS(initialState);
  const $$initialState = Map(state);

  /* store */
  Object.assign(store, createStore(reducer, $$initialState, compose(middleware)));

  return store;
}

/* 注入store */
export function injectReducers(asyncReducer) {
  for (const key in asyncReducer) {
    // 获取reducer的key值，并将reducer保存起来
    if (!(key in store.asyncReducers)) {
      const item = asyncReducer[key];

      store.asyncReducers[key] = item;
    }
  }

  // 异步注入reducer
  store.replaceReducer(createReducer(store.asyncReducers));
}

export default store;