import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import './global.sass';
import Layouts from './components/Layouts/Layouts';
import Routers from './router/Routers';

render(
  <ConfigProvider locale={ zhCN }>
    <HashRouter>
      <Layouts>
        <Routers />
      </Layouts>
    </HashRouter>
  </ConfigProvider>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}