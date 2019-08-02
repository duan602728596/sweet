import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../pages/Index/Layout';

const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */'../pages/List/Layout'));
const FormBundle = asyncModule(() => import(/* webpackChunkName: 'form' */'../pages/Form/Layout'));

class Routers extends Component {
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

export default Routers;