import { createAction, handleActions } from 'redux-actions';

/* Action */
export const setData = createAction('second/数据');

/* reducer */
const reducer = handleActions({
  [setData]($$state, action) {
    return $$state.set('data', action.payload);
  }
}, {});

export default reducer;