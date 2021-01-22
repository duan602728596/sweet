import { createApp } from 'vue';
// import VueMeta from 'vue-meta';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

/* app */
const app = createApp(() => <router-view />);

app.use(storeFactory());
app.use(router);
// app.use(VueMeta);

app.mount('#app');

if (module.hot) {
  module.hot.accept();
}