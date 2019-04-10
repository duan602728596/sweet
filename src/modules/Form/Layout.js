import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';
import Main from '../../assembly/Main/index';
import Sider from '../../assembly/Sider/index';
import Content from '../../assembly/Content/index';
import Index from './Index/index';

/* 配置二、三级导航菜单 */
const options = [
  {
    id: 's1',
    name: '导航菜单1',
    url: '/Form/S1'
  }
];

class ModuleLayout extends Component {
  render() {
    return [
      <Helmet key="helmet">
        <title>表单展示</title>
      </Helmet>,
      <Main key="main">
        <Sider options={ options } />
        <Content>
          <Switch>
            <Route path="/Form" component={ Index } exact={ true } />
            <Route path="/Form/S1" component={ Index } exact={ true } />
          </Switch>
        </Content>
      </Main>
    ];
  }
}

export default ModuleLayout;