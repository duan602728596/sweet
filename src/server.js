require('source-map-support').install();

import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import './global.sass';
import AppRouters from './router/AppRouters';

/* ssr入口文件 */
function server(url, context = {}, initialState = {}) {
  const store = storeFactory(initialState);
  const stream = renderToNodeStream(
    <Provider store={ store }>
      <ConfigProvider locale={ zhCN }>
        <StaticRouter location={ url } context={ context }>
          <AppRouters />
        </StaticRouter>
      </ConfigProvider>
    </Provider>
  );

  Helmet.renderStatic();

  return stream;
}

export default server;