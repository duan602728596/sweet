import { takeEvery, call, put, select } from 'redux-saga/effects';

const sagaEffects = {
  call,
  put,
  select
};

/**
 * 创建saga的effects
 * @param { object } effects
 */
function handleEffects(effects) {
  return function *() {
    for (const key in effects) {
      yield takeEvery(key, function *(action) {
        const value = yield call(effects[key], action, sagaEffects);

        // 将执行的结果挂载到action
        if (value !== undefined) {
          action.result = value;
        }
      });
    }
  };
}

export default handleEffects;