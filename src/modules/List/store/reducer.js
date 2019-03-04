import { handleActions, combineActions } from 'redux-actions';
import * as Immutable from 'immutable';
import { fromJS } from 'immutable';
import module1Reducer, * as module1Action from './module1';

const initData: {
  module1: object;
} = {
  module1: {}
};

/* reducer */
const reducer: Function = handleActions({
  [combineActions(...Object.values(module1Action))]: ($$state: Immutable.Map<string, object>, action: any): Immutable.Map<string, object> => {
    return $$state.set('module1', module1Reducer($$state.get('module1'), action));
  }
}, fromJS(initData));

export default {
  list: reducer
};