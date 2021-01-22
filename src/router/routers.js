import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import Login from '../pages/Login';
import Layout from '../layouts/Layout';
import Index from '../pages/Index';

const SecondBundle = () => import(/* webpackChunkName: 'second' */'../pages/Second/index');

const routesConfig = [
  { path: '/Login', name: 'login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'default', redirect: 'Index' },
      { path: 'Index', name: 'index', component: Index },
      {
        path: 'Second',
        name: 'second',
        component: SecondBundle,
        children: [
          { path: 'Page1', name: 'second-page1', component: SecondBundle },
          { path: 'Page2', name: 'second-page2', component: SecondBundle },
          { path: 'Page3', name: 'second-page3', component: SecondBundle }
        ]
      }
    ]
  }
];

export const router = createRouter({
  history: (typeof window === 'object' ? createWebHistory : createMemoryHistory)(),
  routes: routesConfig
});