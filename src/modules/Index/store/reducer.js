import { createAction, handleActions } from 'redux-actions';
import * as Immutable from 'immutable';
import { fromJS, List } from 'immutable';

const initData: {
  listDisplay: Immutable.List<Array<object>>;
} = {
  listDisplay: List([])
};

/* Action */
export const listDisplayChange: Function = createAction('index/首页列表展示');

/* reducer */
const reducer: Function = handleActions({
  [listDisplayChange]: ($$state: Immutable.Map<string, object>, action: any): Immutable.Map<string, object> => {
    return $$state.set('listDisplay', List(action.payload.listDisplay));
  }
}, fromJS(initData));

export default {
  index: reducer
};