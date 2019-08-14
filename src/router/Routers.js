import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../pages/Index/Layout';

const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */'../pages/Second/Layout'));

class Routers extends Component {
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

export default Routers;