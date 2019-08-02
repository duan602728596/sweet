import { createAction, handleActions } from 'redux-actions';

/* Action */
export const dataList = createAction('list/module1/数据列表');

/* reducer */
const reducer = handleActions({
  [dataList]($$state, action) {
    return $$state.set('dataList', action.payload.dataList);
  }
}, {});

export default reducer;