// @flow
import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData: {
  listDisplay: RecordInstance
} = {
  listDisplay: List([])
};

/* Action */
export const listDisplayChange: Function = createAction('首页列表展示');

/* reducer */
const reducer: Function = handleActions({
  [listDisplayChange]: ($$state: RecordInstance, action: Object): RecordInstance=>{
    return $$state.set('listDisplay', List(action.payload.listDisplay));
  }
}, fromJS(initData));

export default {
  index: reducer
};