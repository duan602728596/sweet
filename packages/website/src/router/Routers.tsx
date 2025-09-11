import type { ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Sweet from '../pages/Sweet/index';
import Demo from '../pages/Demo/index';
import Packages from '../pages/Packages/index';

/* 路由 */
function Routers(props: {}): ReactElement {
  return (
    <Routes>
      <Route path="/" element={ <Navigate to="Sweet/Introduction" replace={ true } /> } />
      <Route path="Sweet/*" element={ <Sweet /> } />
      <Route path="Demo" element={ <Demo /> } />
      <Route path="Packages/*" element={ <Packages /> } />
    </Routes>
  );
}

export default Routers;