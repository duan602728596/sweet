import React from 'react';
import { Layout } from 'antd';
import style from './index.sass';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Routers from '../../router/Routers';

/* 页面整体布局 */
function SystemLayout(props) {
  return (
    <Layout className={ style.layout }>
      <Header />
      <Routers />
      <Footer />
    </Layout>
  );
}

export default SystemLayout;