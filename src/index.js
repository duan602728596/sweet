import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import VueMeta from 'vue-meta';
import App from './App';
import { storeFactory } from './store/store';
import routers from './router/routers';
import './global.sass';

Vue.use(VueCompositionApi);
Vue.use(VueMeta);

/* app */
const index = new Vue({
  store: storeFactory(window.__INITIAL_STATE__ || {}),
  router: routers,
  render() {
    return <App />;
  }
}).$mount(document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}