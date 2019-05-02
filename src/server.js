require('source-map-support').install();

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter, Switch } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { storeFactory } from './store/store';
import './common.sass';
import ServerRouters from './router/ServerRouters';

function server(url, context = {}, initialState = {}) {
  const stream = renderToNodeStream(
    <Provider store={ storeFactory(initialState) }>
      <StaticRouter location={ url } context={ context }>
        <Switch>
          <ServerRouters />
        </Switch>
      </StaticRouter>
    </Provider>
  );
  const helmet = Helmet.renderStatic();

  return stream;
}

export default server;