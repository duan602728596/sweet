import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import asyncModule from './asyncServerModule';
import Index from '../pages/Index/Layout';

/* 服务端渲染组件 */
const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */'../pages/Second/Layout'));

class ServerRouters extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={ Index } exact={ true } />
        <Route path="/Index" component={ Index } />
        <Route path="/Second" component={ SecondBundle } />
      </Switch>
    );
  }
}

export default ServerRouters;