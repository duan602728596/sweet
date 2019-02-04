// @flow
import { handleActions, combineActions } from 'redux-actions';
import { fromJS } from 'immutable';
import module1Reducer, * as module1Action from './module1';

const initData: {
  module1: Object
} = {
  module1: {}
};

/* reducer */
const reducer: Function = handleActions({
  [combineActions(...Object.values(module1Action))]: ($$state: RecordInstance, action: Object): RecordInstance=>{
    return $$state.set('module1', module1Reducer($$state.get('module1'), action));
  }
}, fromJS(initData));

export default {
  list: reducer
};