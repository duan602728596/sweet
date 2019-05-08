require('source-map-support').install();

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { Route, StaticRouter, Switch } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import './common.sass';
import Arrangement from './assembly/Arrangement/server';

function server(url, context = {}, initialState = {}) {
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