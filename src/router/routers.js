import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../modules/Index/Layout';

Vue.use(VueRouter);

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
      component: () => import('../modules/Page/Layout')
    }
  ]
});

export default routers;