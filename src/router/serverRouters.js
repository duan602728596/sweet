import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../modules/Index/Layout';
import Page from '../modules/Page/Layout';

Vue.use(VueRouter);

const serverRouters = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/Index'
    },
    {
      path: '/Index',
      name: 'index',
      component: Index
    },
    {
      path: '/Page',
      name: 'page',
      component: Page
    }
  ]
});

export default serverRouters;