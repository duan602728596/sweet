import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../pages/Index/Layout';

const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */'../pages/Second/Layout'));
const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */'../pages/List/Layout'));

class Routers extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={ Index } exact={ true } />
        <Route path="/Index" component={ Index } />
        <Route path="/Second" component={ SecondBundle } />
        <Route path="/List" component={ ListBundle } />
      </Switch>
    );
  }
}

export default Routers;