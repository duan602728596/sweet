import { handleActions, combineActions } from 'redux-actions';
import { fromJS } from 'immutable';
import secondReducer, * as secondAction from './second';

const initData = {
  second: {
    data: 0
  }
};

/* models */
const reducer = handleActions({
  [combineActions(...Object.values(secondAction))]($$state, action) {
    return $$state.set('second', secondReducer($$state.get('second'), action));
  }
}, fromJS(initData));

export default {
  second: reducer
};