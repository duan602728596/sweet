import { useState } from 'react';
import { Observer } from 'mobx-react';
import { Button, Table, message } from 'antd';
import listStore from './models/list';
import style from './list.sass';

function List(props) {
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