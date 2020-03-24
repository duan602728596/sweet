import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader/root';
import { storeFactory } from './store/store';
import './global.sass';
import AppRouters from './router/AppRouters';

/* 热替换 */
function App(props) {
  return (
    <Provider store={ storeFactory(window.__INITIAL_STATE__ || {}) }>
      <ConfigProvider locale={ zhCN }>
        <BrowserRouter>
          <AppRouters />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default hot(App);