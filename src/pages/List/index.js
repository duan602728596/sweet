import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import asyncLoadReducers from '../../store/asyncLoadReducers';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import models from './reducers/reducers';
import List from './List';

function Index(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App</title>
      </Helmet>
      <Main>
        <Content>
          <List />
        </Content>
      </Main>
    </Fragment>
  );
}

export default asyncLoadReducers(models)(Index);