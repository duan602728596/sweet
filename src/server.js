require('source-map-support').install();

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { Route, Switch } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import { preloadAll } from './router/asyncModule/asyncModuleNode';
import './global.sass';
import Layout from './layouts/Layout/index';
import Login from './pages/Login/Layout';

/* ssr入口文件 */
async function server(url, context = {}, initialState = {}) {
  await preloadAll();

  const store = storeFactory(initialState);
  const stream = renderToNodeStream(
    <Provider store={ store }>
      <ConfigProvider locale={ zhCN }>
        <StaticRouter location={ url } context={ context }>
          <Switch>
            <Route path="/Login" component={ Login } exact={ true } />
            <Route component={ Layout } />
          </Switch>
        </StaticRouter>
      </ConfigProvider>
    </Provider>
  );

  Helmet.renderStatic();

  return stream;
}

export default server;