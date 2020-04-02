import React from 'react';
import { useRoutes } from 'react-router-dom';
import asyncModule from './asyncModule/index';
import Index from '../pages/Index/Routers';

const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */ '../pages/Second/Routers'));
const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */ '../pages/List/Routers'));

function Routers(props) {
  const routes = useRoutes([
    { path: '/', redirectTo: 'Index' },
    { path: 'Index/*', element: <Index /> },
    { path: 'Second/*', element: <SecondBundle /> },
    { path: 'List/*', element: <ListBundle /> }
  ]);

  return routes;
}

export default Routers;