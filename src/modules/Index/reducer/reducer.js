import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';

const initData = {
  listDisplay: List([])
};

/* Action */
export const listDisplayChange = createAction('index/首页列表展示');

/* reducer */
const reducer = handleActions({
  [listDisplayChange]: ($$state, action) => {
    return $$state.set('listDisplay', List(action.payload.listDisplay));
  }
}, fromJS(initData));

export default {
  index: reducer
};