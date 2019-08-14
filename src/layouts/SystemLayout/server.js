import React from 'react';
import { Layout } from 'antd';
import style from './index.sass';
import Header from '../Header/index';
import Footer from '../Footer/index';
import ServerRouters from '../../router/ServerRouters';

/* 页面整体布局 - ssr渲染 */
function SystemLayout(props) {
  return (
    <Layout className={ style.layout }>
      <Header />
      <ServerRouters />
      <Footer />
    </Layout>
  );
}

export default SystemLayout;