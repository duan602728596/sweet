import React from 'react';
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Button, Table, message } from 'antd';
import useActions from '../../../store/useActions';
import { reqDataList } from '../models/models';
import style from './index.sass';

/* actions */
const actions = (dispatch) => ({
  action: bindActionCreators({
    reqDataList
  }, dispatch)
});

/* state */
const state = createStructuredSelector({
  dataList: createSelector(
    ($$state) => $$state.has('list') ? $$state.get('list').get('dataList').toJS() : [],
    (data) => data
  )
});

function List(props) {
  const { dataList } = useSelector(state);
  const { action } = useActions(actions);

  // 点击加载
  async function handleLoadDataClick(event) {
    const { result: res } = await action.reqDataList(3);

    if (res === true) {
      message.success('success!');
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' }
  ];

  return (
    <div>
      <Button className={ style.btn } onClick={ handleLoadDataClick }>加载数据</Button>
      <Table columns={ columns } dataSource={ dataList } rowKey={ (record, index) => record.id } />
    </div>
  );
}

export default List;