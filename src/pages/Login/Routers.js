import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Index from './Index/index';

function Routers(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App - login</title>
      </Helmet>
      <Index />
    </Fragment>
  );
}

export default Routers;