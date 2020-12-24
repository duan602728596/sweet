require('source-map-support').install();

import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Helmet } from 'react-helmet';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { enableStaticRendering } from 'mobx-react';
import { preloadAll } from './router/asyncModule/asyncModuleNode';
import './global.sass';
import AppRouters from './router/AppRouters';

enableStaticRendering(true);

/* ssr入口文件 */
async function server(url, context = {}, initialState = {}) {
  globalThis.__INITIAL_STATE__ = initialState;
  await preloadAll();

  const stream = renderToNodeStream(
    <ConfigProvider locale={ zhCN }>
      <StaticRouter location={ url } context={ context }>
        <AppRouters />
      </StaticRouter>
    </ConfigProvider>
  );

  Helmet.renderStatic();

  return stream;
}

export default server;