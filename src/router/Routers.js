// @flow
import * as React from 'react';
import { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../modules/Index/Layout';

const ListBundle: Function = asyncModule(
  (): Promise<React.ChildrenArray<React.Node>> => import('../modules/List/Layout'));
const FormBundle: Function = asyncModule(
  (): Promise<React.ChildrenArray<React.Node>> => import('../modules/Form/Layout'));

class Routers extends Component<{}>{
  render(): React.Node{
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