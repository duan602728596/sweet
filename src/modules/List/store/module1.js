// @flow
import { createAction, handleActions } from 'redux-actions';

/* Action */
export const dataList: Function = createAction('数据列表');

/* reducer */
const reducer: Object = handleActions({
  [dataList]: ($$state: RecordInstance, action: Object): RecordInstance=>{
    return $$state.set('dataList', action.payload.dataList);
  }
}, {});

export default reducer;