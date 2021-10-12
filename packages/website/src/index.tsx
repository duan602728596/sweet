import type { ReactNode } from 'react';
// @ts-ignore react@18
import { createRoot } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import './global.sass';
import Layouts from './components/Layouts/Layouts';
import Routers from './router/Routers';

interface Root {
  render(element: ReactNode): void;
}

const root: Root = createRoot(document.getElementById('app'));

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