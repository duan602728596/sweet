import { useRoutes } from 'react-router-dom';
import asyncModule from './asyncModule/index';
import Index from '../pages/Index/index';

const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */ '../pages/Second/index'));
const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */ '../pages/List/index'));

function Routers(props) {
  const routes = useRoutes([
    { path: '//*', element: <Index /> },
    { path: 'Second/*', element: <SecondBundle /> },
    { path: 'List/*', element: <ListBundle /> }
  ]);

  return routes;
}

export default Routers;