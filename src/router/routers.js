import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/store';
import Index from '../modules/Index/Layout';

Vue.use(VueRouter);

const PageBundle = () => import(/* webpackChunkName: 'page' */'../modules/Page/Layout');

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

routers.beforeResolve(function(to, from, next) {
  const { matched } = to;

  for (const item of matched) {
    const actions = item?.components?.default?.options?.actions;

    if (actions) {
      store.injectModule(actions);
    }
  }

  next();
});

export default routers;