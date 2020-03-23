import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';

export default {
  render() {
    return (
      <div class="app" id="app">
        <ConfigProvider locale={ zhCN }>
          <router-view />
        </ConfigProvider>
      </div>
    );
  }
};