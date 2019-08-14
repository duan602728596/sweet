import React from 'react';
import { Layout as AntdLayout } from 'antd';
import style from './index.sass';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Routers from '../../router/Routers';

/* 页面整体布局 */
function Layout(props) {
  return (
    <AntdLayout className={ style.layout }>
      <Header />
      <Routers />
      <Footer />
    </AntdLayout>
  );
}

export default Layout;