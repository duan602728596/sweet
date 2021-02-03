import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Button, Table, message } from 'antd';
import { requestList } from './reducers/reducers';
import style from './list.sass';

/* state */
const selector = createStructuredSelector({
  dataList: createSelector(({ list }) => list.dataList, (data) => data)
});

function List(props) {
  const { dataList } = useSelector(selector);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 点击加载
  async function handleLoadDataClick(event) {
    setLoading(true);

    const res = await dispatch(requestList({ num: 3 }));

    if (res) {
      message.success('success!');
    }

    setLoading(false);
  }

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' }
  ];

  return (
    <div>
      <Button className={ style.btn } onClick={ handleLoadDataClick }>加载数据</Button>
      <Table columns={ columns } dataSource={ dataList } loading={ loading } rowKey="id" />
    </div>
  );
}

export default List;