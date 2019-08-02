import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import Main from '../../layouts/Main/index';
import Content from '../../layouts/Content/index';
import Index from './Index/index';

class ModuleLayout extends Component {
  render() {
    return [
      <Helmet key="helmet">
        <title>Webpack App</title>
      </Helmet>,
      <Main key="main">
        <Content>
          <Switch>
            <Route path="/" component={ Index } exact={ true } />
            <Route path="/Index" component={ Index } exact={ true } />
          </Switch>
        </Content>
      </Main>
    ];
  }
}

export default ModuleLayout;