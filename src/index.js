import { createApp } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { createHead } from '@vueuse/head';
import { router } from './router/routers';
import { piniaFactory } from './store/pinia';
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

app.use(piniaFactory(window.__INITIAL_STATE__));
app.use(router);
app.use(head);

app.mount('#app');

if (module.hot) {
  module.hot.accept();
}