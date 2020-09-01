require('source-map-support').install();

import { createSSRApp } from 'vue';
import { renderToStream } from '@vue/server-renderer';
// // import VueMeta from 'vue-meta';
import { cloneDeep } from 'lodash-es';
import App from './App';
import { storeFactory } from './store/store';
import { createRouters } from './router/routers';
import './global.sass';

// Vue.use(VueMeta);

function server(url, context = {}, initialState = {}) {
  const cloneData = cloneDeep(initialState);
  const routers = createRouters();

  /* app */
  const app = createSSRApp(<App />);

  app.use(storeFactory(cloneData));
  app.use(routers);

  routers.push(url);

  return new Promise((resolve, reject) => {
    routers.isReady().then(() => {
      resolve(renderToStream(app, context));
    });
  });
}

export default server;