import { createAction, handleActions } from 'redux-actions';

/* Action */
export const dataList: Function = createAction('数据列表');

/* reducer */
const reducer: object = handleActions({
  [dataList]: ($$state: Immutable.Map, action: object): Immutable.Map=>{
    return $$state.set('dataList', action.payload.dataList);
  }
}, {});

export default reducer;