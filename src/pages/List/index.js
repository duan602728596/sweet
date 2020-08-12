import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import loadModels from '../../store/loadModels';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import models from './models/models';
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

export default loadModels(models)(Index);