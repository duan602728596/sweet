import { Fragment } from 'react';
import { useRoutes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import indexStore from './models/index';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import Welcome from './Welcome';

function Index(props) {
  indexStore.ssrInit();

  const routes = useRoutes([
    { path: '/', element: <Welcome /> },
    { path: 'Index', element: <Welcome /> }
  ]);

  return (
    <Fragment>
      <Helmet>
        <title>Webpack App</title>
      </Helmet>
      <Main>
        <Content>{ routes }</Content>
      </Main>
    </Fragment>
  );
}

export default Index;