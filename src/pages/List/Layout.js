import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import loadReducer from '../../store/loadReducer';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import models from './models/models';
import Index from './Index/index';

function ModuleLayout(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App</title>
      </Helmet>
      <Main>
        <Content>
          <Routes>
            <Route path="//*" element={ <Index /> } exact={ true } />
          </Routes>
        </Content>
      </Main>
    </Fragment>
  );
}

export default loadReducer(models)(ModuleLayout);