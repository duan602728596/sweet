require('source-map-support').install();

import { createSSRApp } from 'vue';
import { renderToNodeStream } from '@vue/server-renderer';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { createHead } from '@vueuse/head';
import { cloneDeep } from 'lodash-es';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

if (typeof requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = function(fn) {
    setTimeout(fn, 0);
  };
}

const head = createHead();

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
  app.use(head);

  router.push(url);
  await router.isReady();

  return renderToNodeStream(app);
}

export default server;