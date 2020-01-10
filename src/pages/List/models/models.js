import { createAction, handleActions } from 'redux-actions';
import { fromJS, List } from 'immutable';
import handleEffects from '../../../store/handleEffects';

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
export const reqDataList = createAction('list/创建列表');
export const setDataList = createAction('list/列表');

/* saga effects */
const effects = handleEffects({
  *[reqDataList](action, _) {
    yield _.put(setDataList(res));

    return true;
  }
});

/* reducer */
const reducer = handleActions({
  [setDataList]($$state, action) {
    return $$state.set('dataList', List(action.payload));
  }
}, fromJS(initData));

export default {
  namespace: 'list',
  reducer,
  effects
};