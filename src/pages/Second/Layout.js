import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import { FolderOpenOutlined as IconFolderOpenOutlined } from '@ant-design/icons';
import loadReducer from '../../store/loadReducer';
import Main from '../../layouts/Main';
import Content from '../../layouts/Content';
import Sider from '../../layouts/Sider/index';
import reducer from './reducer/reducer';
import Index from './Index/index';

const options = [
  {
    id: 'page-0',
    name: '导航菜单-0',
    url: '/Second'
  },
  {
    id: 'page-1',
    name: '导航菜单-1',
    url: '/Second/Page1'
  },
  {
    id: 'page-2',
    name: '导航菜单-2',
    icon: <IconFolderOpenOutlined />,
    children: [
      {
        id: 'page-2-0',
        name: '子导航-2-0',
        url: '/Second/Page2'
      },
      {
        id: 'page-2-1',
        name: '子导航-2-1',
        url: '/Second/Page3'
      }
    ]
  }
];

function ModuleLayout(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Webpack App - second</title>
      </Helmet>
      <Main>
        <Sider options={ options } />
        <Content>
          <Switch>
            <Route path="/Second" component={ Index } exact={ true } />
            <Route path="/Second/page1" component={ Index } exact={ true } />
            <Route path="/Second/page2" component={ Index } exact={ true } />
            <Route path="/Second/page3" component={ Index } exact={ true } />
          </Switch>
        </Content>
      </Main>
    </Fragment>
  );
}

export default loadReducer(reducer)(ModuleLayout);