require('source-map-support').install();

import { createSSRApp } from 'vue';
import { renderToStream } from '@vue/server-renderer';
// import VueMeta from 'vue-meta';
import { cloneDeep } from 'lodash-es';
import App from './App';
import { storeFactory } from './store/store';
import { createRouters } from './router/routers';
import './global.sass';

async function server(url, context = {}, initialState = {}) {
  const cloneData = cloneDeep(initialState);
  const routers = createRouters();

  /* app */
  const app = createSSRApp(App);

  app.use(storeFactory(cloneData));
  app.use(routers);
  // app.use(VueMeta);

  routers.push(url);
  await routers.isReady();

  return renderToStream(app);
}

export default server;