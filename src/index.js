// @flow
// @jsx this.$createElement
import Vue from 'vue';
import { Helmet, HelmetProvider } from '@jnields/vue-helmet';
import App from './App';
import { storeFactory } from './store/store';
import routers from './router/routers';

Vue.component('helmet', Helmet);
Vue.component('helmet-provider', HelmetProvider);

/* app */
const index: Vue = new Vue({
  el: '#app',
  store: storeFactory(window.__INITIAL_STATE__ || {}),
  router: routers,
  render(): Vue.VNode {
    return <App />;
  }
});

// $FlowFixMe
if (module.hot) module.hot.accept();