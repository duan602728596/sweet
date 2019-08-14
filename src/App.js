import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader';
import { storeFactory } from './store/store';
import './global.sass';
import SystemLayout from './layouts/SystemLayout/index';
import Login from './pages/Login/Layout';

/* 热替换 */
@hot(module)
class App extends Component {
  render() {
    return (
      <Provider store={ storeFactory(window.__INITIAL_STATE__ || {}) }>
        <ConfigProvider locale={ zhCN }>
          <BrowserRouter>
            <Switch>
              <Route path="/Login" component={ Login } exact={ true } />
              <Route component={ SystemLayout } exact={ true } />
            </Switch>
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    );
  }
}
export default App;