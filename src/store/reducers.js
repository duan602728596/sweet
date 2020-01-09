import { combineReducers } from 'redux-immutable';
import { fork } from 'redux-saga/effects';
import indexModels from '../pages/Index/models/models';

/* reducers */
const reducers = {
  [indexModels.namespace]: indexModels.reducer
};

/* saga */
const sagas = {};

/* 创建reducer */
export function createReducer(asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}

/* 创建saga */
export function createSagas(sagaMiddleware) {
  const queue = [];

  for (const key in sagas) {
    queue.push(fork(sagas[key]));
  }

  sagaMiddleware.run(function *() {
    yield queue;
  });
}