import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader/root';
import './global.sass';
import AppRouters from './router/AppRouters';

/* 热替换 */
function App(props) {
  return (
    <ConfigProvider locale={ zhCN }>
      <BrowserRouter>
        <AppRouters />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default hot(App);