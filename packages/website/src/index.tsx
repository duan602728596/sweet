import { createRoot, type Root } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
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