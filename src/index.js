import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import './global.sass';
import AppRouters from './router/AppRouters';

const initialState = window.__INITIAL_STATE__ || {};
const root = createRoot(document.getElementById('app'));

root.render(
  <Provider store={ storeFactory(initialState) } serverState={ initialState }>
    <ConfigProvider locale={ zhCN }>
      <BrowserRouter>
        <AppRouters />
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);

if (module.hot) {
  module.hot.accept();
}