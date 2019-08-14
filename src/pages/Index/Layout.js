import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import Index from './Index/index';

function ModuleLayout(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App</title>
      </Helmet>
      <Main>
        <Content>
          <Switch>
            <Route path="/" component={ Index } exact={ true } />
            <Route path="/Index" component={ Index } exact={ true } />
          </Switch>
        </Content>
      </Main>
    </Fragment>
  );
}

export default ModuleLayout;