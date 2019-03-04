import * as Immutable from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/* Action */
export const dataList: Function = createAction('list/module1/数据列表');

/* reducer */
const reducer: Object = handleActions({
  [dataList]: ($$state: Immutable.Map<string, object>, action: any): Immutable.Map<string, object> => {
    return $$state.set('dataList', action.payload.dataList);
  }
}, {});

export default reducer;