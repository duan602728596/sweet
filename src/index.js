import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
// import VueMeta from 'vue-meta';
import routes from './router/routers';
import { storeFactory } from './store/store';
import './global.sass';

export const router = createRouter({
  history: createWebHistory(),
  routes
});

/* app */
const app = createApp(() => <router-view />);

app.use(storeFactory());
app.use(router);
// app.use(VueMeta);

app.mount('#app');

if (module.hot) {
  module.hot.accept();
}