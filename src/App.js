import { LocaleProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
import Arrangement from './layouts/Arrangement/index';

export default {
  name: 'App',
  render() {
    return (
      <div class="app" id="app">
        <LocaleProvider locale={ zhCN }>
          <Arrangement />
        </LocaleProvider>
      </div>
    );
  }
};