import { createApp } from 'vue';
// import VueMeta from 'vue-meta';
import App from './App';
import { storeFactory } from './store/store';
import routers from './router/routers';
import './global.sass';


/* app */
const app = createApp(App);

app.use(storeFactory());
app.use(routers);
// app.use(VueMeta);

app.mount(document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}