import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import asyncModule from './asyncModule/index';
import Index from '../pages/Index/Layout';

const SecondBundle = asyncModule(() => import(/* webpackChunkName: 'second' */'../pages/Second/Layout'));
const ListBundle = asyncModule(() => import(/* webpackChunkName: 'list' */'../pages/List/Layout'));

class Routers extends Component {
  render() {
    return (
      <Routes>
        <Route path="//*" element={ <Index /> } />
        <Route path="Index/*" element={ <Index /> } />
        <Route path="Second/*" element={ <SecondBundle /> } />
        <Route path="List/*" element={ <ListBundle /> } />
      </Routes>
    );
  }
}

export default Routers;