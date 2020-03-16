import { createAction, handleActions } from 'redux-actions';

/* Action */
export const setData = createAction('second/数据');

/* models */
const reducer = handleActions({
  [setData](state, action) {
    return { ...state, data: action.payload };
  }
}, {});

export default reducer;