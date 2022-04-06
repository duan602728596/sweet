// eslint-disable-next-line spaced-comment
/// <reference types="react/next" />

import { createRoot, type Root } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import './global.sass';
import Layouts from './components/Layouts/Layouts';
import Routers from './router/Routers';

const root: Root = createRoot(document.getElementById('app')!);

root.render(
  <ConfigProvider locale={ zhCN }>
    <HashRouter>
      <Layouts>
        <Routers />
      </Layouts>
    </HashRouter>
  </ConfigProvider>
);

declare const module: any;

if (module.hot) {
  module.hot.accept();
}