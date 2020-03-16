import { createAction, handleActions } from 'redux-actions';

const initData = {
  likeLen: 0
};

/* Action */
export const setLikeLen = createAction('index/点赞');

/* models */
const reducer = handleActions({
  [setLikeLen](state, action) {
    return { ...state, likeLen: action.payload };
  }
}, initData);

export default {
  index: reducer
};