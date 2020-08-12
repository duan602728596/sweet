import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Button, Table, message } from 'antd';
import { reqDataList } from './models/models';
import style from './list.sass';

/* state */
const state = createStructuredSelector({
  dataList: createSelector(
    ({ list: $$List }) => $$List?.get?.('dataList').toJS() ?? [],
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

    const res = await dispatch(reqDataList({ num: 3 }));

    if (res === true) {
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
      <Table columns={ columns } dataSource={ dataList } loading={ loading } rowKey={ (record, index) => record.id } />
    </div>
  );
}

export default List;