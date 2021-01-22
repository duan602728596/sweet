require('source-map-support').install();

import { createSSRApp } from 'vue';
import { renderToStream } from '@vue/server-renderer';
// import VueMeta from 'vue-meta';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { cloneDeep } from 'lodash-es';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

async function server(url, context = {}, initialState = {}) {
  const cloneData = cloneDeep(initialState);

  /* app */
  const app = createSSRApp(() => (
    <div class="app" id="app">
      <div class="app" data-v-hmr="">
        <ConfigProvider locale={ zhCN }>
          <router-view />
        </ConfigProvider>
      </div>
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