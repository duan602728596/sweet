import { createAction, handleActions } from 'redux-actions';

/* Action */
export const setData = createAction('second/数据');

/* models */
export default handleActions({
  [setData]($$state, action) {
    return $$state.set('data', action.payload);
  }
}, {});