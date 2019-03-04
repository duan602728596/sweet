import { combineReducers } from 'redux-immutable';
import indexReducer from '../modules/Index/store/reducer';

/* reducers */
const reducers: object = {
  ...indexReducer
};

/* 创建reducer */
export function createReducer(asyncReducers: object): Function {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}