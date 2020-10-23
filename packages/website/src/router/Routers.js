import { useRoutes, Navigate } from 'react-router-dom';
import Sweet from '../pages/Sweet/index';
import Demo from '../pages/Demo/index';
import Packages from '../pages/Packages/index';

function Routers(props) {
  const routes = useRoutes([
    { path: '/', element: <Navigate to="Sweet/Introduction" replace={ true } /> },
    { path: 'Sweet/*', element: <Sweet /> },
    { path: 'Demo', element: <Demo /> },
    { path: 'Packages/*', element: <Packages /> }
  ]);

  return routes;
}

export default Routers;