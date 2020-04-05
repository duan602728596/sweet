import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Login from './Login';

function Index(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App - login</title>
      </Helmet>
      <Login />
    </Fragment>
  );
}

export default Index;