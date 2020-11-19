import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
import './global.sass';

/* App */
function App() {
  return (
    <div class="app" id="app">
      <ConfigProvider locale={ zhCN }>
        <router-view />
      </ConfigProvider>
    </div>
  );
}

export default App;