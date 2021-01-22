import { createApp } from 'vue';
// import VueMeta from 'vue-meta';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

/* app */
const app = createApp(() => (
  <div class="app" data-v-hmr="">
    <ConfigProvider>
      <router-view locale={ zhCN } />
    </ConfigProvider>
  </div>
));

app.use(storeFactory());
app.use(router);
// app.use(VueMeta);

app.mount('#app');

if (module.hot) {
  module.hot.accept();
}