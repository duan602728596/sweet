import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Index from './Index/index';

function ModuleLayout(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App - login</title>
      </Helmet>
      <Routes>
        <Route path="Login" element={ <Index /> } exact={ true } />
      </Routes>
    </Fragment>
  );
}

export default ModuleLayout;