import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../pages/Index/Layout';

Vue.use(VueRouter);

const PageBundle = () => import(/* webpackChunkName: 'page' */'../pages/Page/Layout');

const routers = new VueRouter({
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
      component: PageBundle
    }
  ]
});

export default routers;