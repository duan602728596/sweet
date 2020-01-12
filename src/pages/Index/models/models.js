import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

const initData = {
  likeLen: 0
};

/* Action */
export const setLikeLen = createAction('index/点赞');

/* models */
const reducer = handleActions({
  [setLikeLen]($$state, action) {
    return $$state.set('likeLen', action.payload);
  }
}, fromJS(initData));

export default {
  index: reducer
};