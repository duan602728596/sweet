import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import asyncModule from './asyncServerModule';
import Index from '../modules/Index/Layout';

/* 服务端渲染组件 */
const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */'../modules/List/Layout'));
const FormBundle = asyncModule(() => import(/* webpackChunkName: 'form' */'../modules/Form/Layout'));

class ServerRouters extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={ Index } exact={ true } />
        <Route path="/Index" component={ Index } />
        <Route path="/List" component={ ListBundle } />
        <Route path="/Form" component={ FormBundle } />
      </Switch>
    );
  }
}

export default ServerRouters;