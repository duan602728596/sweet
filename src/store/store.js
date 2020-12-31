/* 全局的store */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducers, asyncReducers } from './reducers';

/* reducer列表 */
const reducer = combineReducers(reducers);

/* store */
export let store;

export function storeFactory(initialState = {}) {
  // 避免热替换导致redux的状态丢失
  if (!store) {
    /* store */
    store = configureStore({
      reducer,
      preloadedState: initialState
    });
  }

  return store;
}

/* 注入store */
export function injectReducers(asyncReducer) {
  for (const key in asyncReducer) {
    // 获取reducer的key值，并将reducer保存起来
    if (!(key in asyncReducers)) {
      const item = asyncReducer[key];

      asyncReducers[key] = item;
    }
  }

  // 异步注入reducer
  store.replaceReducer(combineReducers({
    ...reducers,
    ...asyncReducers
  }));
}