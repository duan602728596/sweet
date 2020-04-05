import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import Welcome from './Welcome';

function Index(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App</title>
      </Helmet>
      <Main>
        <Content>
          <Welcome />
        </Content>
      </Main>
    </Fragment>
  );
}

export default Index;