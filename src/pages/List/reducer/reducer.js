import { handleActions, combineActions } from 'redux-actions';
import { fromJS } from 'immutable';
import module1Reducer, * as module1Action from './module1';

const initData = {
  module1: {}
};

/* reducer */
const reducer = handleActions({
  [combineActions(...Object.values(module1Action))]($$state, action) {
    return $$state.set('module1', module1Reducer($$state.get('module1'), action));
  }
}, fromJS(initData));

export default {
  list: reducer
};