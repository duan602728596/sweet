require('source-map-support').install();

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import Loadable from 'react-loadable';
import { Route, StaticRouter, Switch } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import './global.sass';
import Arrangement from './layouts/Arrangement/server';

async function server(url, context = {}, initialState = {}) {
  await Loadable.preloadAll();

  const stream = renderToNodeStream(
    <Provider store={ storeFactory(initialState) }>
      <LocaleProvider locale={ zhCN }>
        <StaticRouter location={ url } context={ context }>
          <Switch>
            <Route path="/Login" component={ (props) => <div>登录</div> } exact={ true } />
            <Route component={ Arrangement } exact={ true } />
          </Switch>
        </StaticRouter>
      </LocaleProvider>
    </Provider>
  );
  const helmet = Helmet.renderStatic();

  return stream;
}

export default server;