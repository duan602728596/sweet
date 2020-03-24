import React from 'react';
import { Routes, useRoutes } from 'react-router-dom';
import asyncModule from './asyncModule/index';
import Index from '../pages/Index/Layout';

const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */'../pages/Second/Layout'));
const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */'../pages/List/Layout'));

function Routers(props) {
  const routes = useRoutes([
    { path: 'Index/*', element: <Index /> },
    { path: '/', redirectTo: 'Index' },
    { path: 'Second/*', element: <SecondBundle /> },
    { path: 'List/*', element: <ListBundle /> }
  ]);

  return routes;
}

export default Routers;