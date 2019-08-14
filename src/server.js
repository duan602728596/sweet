require('source-map-support').install();

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import Loadable from 'react-loadable';
import { Route, StaticRouter, Switch } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import './global.sass';
import SystemLayout from './layouts/SystemLayout/server';
import Login from './pages/Login/Layout';

/* ssr入口文件 */
async function server(url, context = {}, initialState = {}) {
  await Loadable.preloadAll();

  const stream = renderToNodeStream(
    <Provider store={ storeFactory(initialState) }>
      <ConfigProvider locale={ zhCN }>
        <StaticRouter location={ url } context={ context }>
          <Switch>
            <Route path="/Login" component={ Login } exact={ true } />
            <Route component={ SystemLayout } exact={ true } />
          </Switch>
        </StaticRouter>
      </ConfigProvider>
    </Provider>
  );

  Helmet.renderStatic();

  return stream;
}

export default server;