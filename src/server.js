require('source-map-support').install();

import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { red } from '@ant-design/colors';
import { storeFactory } from './store/store';
import './global.sass';
import AppRouters from './router/AppRouters';

/* ssr入口文件 */
function server(url, context = {}, initialState = {}) {
  context.respond = false;
  context.body = null;
  context.res.statusCode = 200;
  context.res.setHeader('Content-type', 'text/html');

  return new Promise((resolve, reject) => {
    const store = storeFactory(initialState);
    const html = context.renderHtml('<@SPLIT@>').split(/<@SPLIT@>/);

    const { pipe, abort } = renderToPipeableStream(
      <Provider store={ store }>
        <ConfigProvider theme={{ token: { colorPrimary: red.primary } }} locale={ zhCN }>
          <StaticRouter location={ url } context={ context }>
            <AppRouters />
          </StaticRouter>
        </ConfigProvider>
      </Provider>,
      {
        onAllReady() {
          context.res.write(html[0]);
          pipe(context.res);
          context.res.write(html[1]);
          resolve();
        },
        onShellError() {
          context.res.write(`${ html[0] }${ html[1] }`);
          context.res.end(null);
        }
      }
    );
  }).then(() => {
    Helmet.renderStatic();
  });
}

export default server;