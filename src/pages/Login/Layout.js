import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import Index from './Index/index';

function ModuleLayout(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App - login</title>
      </Helmet>
      <Switch>
        <Route path="/Login" component={ Index } exact={ true } />
      </Switch>
    </Fragment>
  );
}

export default ModuleLayout;