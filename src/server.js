require('source-map-support').install();

import Vue from 'vue';
import { Helmet, HelmetProvider } from '@jnields/vue-helmet';
import { createRenderer } from 'vue-server-renderer';
import App from './App';
import { storeFactory } from './store/store';
import serverRouters from './router/serverRouters';
import './common.sass';

Vue.component('helmet', Helmet);
Vue.component('helmet-provider', HelmetProvider);

const renderer = createRenderer();

function server(url, context = {}, initialState = {}) {
  /* app */
  const app = new Vue({
    store: storeFactory(initialState),
    router: serverRouters,
    render() {
      return <App />;
    }
  });

  serverRouters.push('_path' in context ? context._path : context.path);

  return new Promise((resolve, reject) => {
    serverRouters.onReady(() => {
      resolve(renderer.renderToStream(app));
    });
  });
}

export default server;