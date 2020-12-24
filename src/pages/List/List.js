import { useState } from 'react';
import { Observer } from 'mobx-react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Button, Table, message } from 'antd';
import { requestList } from './reducers/reducers';
import listStore from './models/list';
import style from './list.sass';

/* state */
const state = createStructuredSelector({
  dataList: createSelector(
    ({ list }) => list.dataList,
    (data) => data
  )
});

function List(props) {
  const { dataList } = useSelector(state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 点击加载
  async function handleLoadDataClick(event) {
    setLoading(true);

    await listStore.requestList();
    message.success('success!');
    setLoading(false);
  }

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' }
  ];

  return (
    <div>
      <Button className={ style.btn } onClick={ handleLoadDataClick }>加载数据</Button>
      <Observer>
        { () => <Table columns={ columns } dataSource={ listStore.dataList } loading={ loading } rowKey="id" /> }
      </Observer>
    </div>
  );
}

export default List;