import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader/root';
import './global.sass';
import Layouts from './components/Layouts/Layouts';
import Routers from './router/Routers';

/* 热替换 */
function App(props) {
  return (
    <ConfigProvider locale={ zhCN }>
      <HashRouter>
        <Layouts>
          <Routers />
        </Layouts>
      </HashRouter>
    </ConfigProvider>
  );
}

export default hot(App);