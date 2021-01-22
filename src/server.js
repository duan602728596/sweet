require('source-map-support').install();

import { createSSRApp } from 'vue';
import { renderToStream } from '@vue/server-renderer';
// import VueMeta from 'vue-meta';
import { cloneDeep } from 'lodash-es';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

async function server(url, context = {}, initialState = {}) {
  const cloneData = cloneDeep(initialState);

  /* app */
  const app = createSSRApp(() => (
    <div className="app" id="app">
      <router-view />
    </div>
  ));

  app.use(storeFactory(cloneData));
  app.use(router);
  // app.use(VueMeta);

  router.push(url);
  await router.isReady();

  return renderToStream(app);
}

export default server;