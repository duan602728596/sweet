import { LocaleProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';

export default {
  render() {
    return (
      <div class="app" id="app">
        <LocaleProvider locale={ zhCN }>
          <router-view />
        </LocaleProvider>
      </div>
    );
  }
};