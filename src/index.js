import { createApp } from 'vue';
// import VueMeta from 'vue-meta';
import App from './App';
import { storeFactory } from './store/store';
import { createRouters } from './router/routers';
import './global.sass';


/* app */
const app = createApp(App);

app.use(storeFactory());
app.use(createRouters());
// app.use(VueMeta);

app.mount(document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./App', function() {
    app.mount(document.getElementById('app'));
  });
}