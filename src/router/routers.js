import { createRouter } from 'vue-router';
import Layout from '../layouts/Layout/index';
import Login from '../pages/Login/index';
import Index from '../pages/index';

const SecondBundle = () => import(/* webpackChunkName: 'second' */'../pages/Second/index');

const routers = {};
const history = require('./createHistory');

export function createRouters() {
  if (!routers.routers) {
    routers.routers = createRouter({
      history: history(),
      routes: [
        {
          path: '/Login',
          name: 'login',
          component: Login
        },
        {
          path: '/',
          component: Layout,
          children: [
            {
              path: '',
              name: 'default',
              redirect: 'Index'
            },
            {
              path: 'Index',
              name: 'index',
              component: Index
            },
            {
              path: 'Second',
              name: 'second',
              component: SecondBundle,
              children: [
                {
                  path: 'Page1',
                  name: 'second-page1',
                  component: SecondBundle
                },
                {
                  path: 'Page2',
                  name: 'second-page2',
                  component: SecondBundle
                },
                {
                  path: 'Page3',
                  name: 'second-page3',
                  component: SecondBundle
                }
              ]
            }
          ]
        }
      ]
    });
  }

  return routers.routers;
}

export default routers;