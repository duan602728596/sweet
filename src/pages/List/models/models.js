import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import createAsyncAction from '../../../store/createAsyncAction';

// mock
const res = [
  { id: '0', name: '关羽' },
  { id: '1', name: '刘备' },
  { id: '2', name: '夏侯惇' }
];

const initData = {
  dataList: []
};

/* Action */
export const setDataList = createAction('list/列表');
export const reqDataList = createAsyncAction(async function(_, args) {
  const data = await _.delay(1000, res);

  await _.put(setDataList(data));

  return true;
});

/* reducer */
const reducer = handleActions({
  [setDataList]($$state, action) {
    return $$state.set('dataList', List(action.payload));
  }
}, fromJS(initData));

export default {
  namespace: 'list',
  reducer
};