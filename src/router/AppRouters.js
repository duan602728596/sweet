import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from '../pages/Login/Layout';
import Layout from '../layouts/Layout';

function AppRouters(props) {
  const routes = useRoutes([
    { path: 'Login', element: <Login /> },
    { path: '*', element: <Layout /> }
  ]);

  return routes;
}

export default AppRouters;