import { createApp } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { createHead } from '@vueuse/head';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

const head = createHead();

/* app */
const app = createApp(() => (
  <div class="app" data-v-hmr="">
    <ConfigProvider locale={ zhCN }>
      <router-view />
    </ConfigProvider>
  </div>
));

app.use(storeFactory());
app.use(router);
app.use(head);

app.mount('#app');

if (module.hot) {
  module.hot.accept();
}