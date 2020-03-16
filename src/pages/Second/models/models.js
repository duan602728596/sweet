import { handleActions, combineActions } from 'redux-actions';
import secondReducer, * as secondAction from './second';

const initData = {
  second: {
    data: 0
  }
};

/* models */
const reducer = handleActions({
  [combineActions(...Object.values(secondAction))](state, action) {
    return { ...state, second: secondReducer(state.second, action) };
  }
}, initData);

export default {
  second: reducer
};