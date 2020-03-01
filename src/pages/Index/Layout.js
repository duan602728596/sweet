import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
          <Routes>
            <Route path="//*" element={ <Index /> } exact={ true } />
          </Routes>
        </Content>
      </Main>
    </Fragment>
  );
}

export default ModuleLayout;