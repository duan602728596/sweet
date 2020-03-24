import React, { Fragment } from 'react';
import { useRoutes } from 'react-router-dom';
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
          <Index />
        </Content>
      </Main>
    </Fragment>
  );
}

export default ModuleLayout;