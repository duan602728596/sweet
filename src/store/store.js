/**
 * 全局的store
 */
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, cancel } from 'redux-saga/effects';
import { fromJS, Map } from 'immutable';
import { createReducer, createSagas } from './reducers';

/* reducer列表 */
const reducer = createReducer({});

/* 中间件 */
const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware);

/* store */
const store = {
  asyncReducers: {},
  sagas: {},
  sagaTasks: {}
};

export function closeAllSagas() {
  sagaMiddleware.run(function *() {
    for (const key in store.sagaTasks) {
      yield cancel(store.sagaTasks[key]);
    }
  });
}

export function storeFactory(initialState = {}) {
  /* initialState */
  const state = fromJS(initialState);
  const $$initialState = Map(state);

  /* store */
  Object.assign(store, createStore(reducer, $$initialState, compose(middleware)), {
    closeAllSagas
  });

  createSagas(sagaMiddleware);

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

export function injectSagas(sagas) {
  sagaMiddleware.run(function *() {
    for (const key in sagas) {
      // 获取sagas的key值，并将sagas保存起来
      if (!(key in store.sagas)) {
        const item = sagas[key];

        // 记录任务
        store.sagaTasks[key] = yield fork(item);
      }
    }
  });
}

export default store;