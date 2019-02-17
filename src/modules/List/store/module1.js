// @flow
import * as Immutable from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/* Action */
export const dataList: Function = createAction('数据列表');

/* reducer */
const reducer: Object = handleActions({
  [dataList]: ($$state: Immutable.Map<string, Object>, action: Object): Immutable.Map<string, Object> => {
    return $$state.set('dataList', action.payload.dataList);
  }
}, {});

export default reducer;