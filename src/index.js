import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from './App';
import { storeFactory } from './store/store';
import routers from './router/routers';

Vue.use(VueMeta);

/* app */
const index = new Vue({
  el: '#app',
  store: storeFactory(window.__INITIAL_STATE__ || {}),
  router: routers,
  render() {
    return <App />;
  }
});

if (module.hot) {
  module.hot.accept();
}