import Vue from 'vue';
import Component from 'vue-class-component';
import { LocaleProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';

@Component
class App extends Vue {
  render() {
    return (
      <div class="app" id="app">
        <LocaleProvider locale={ zhCN }>
          <router-view />
        </LocaleProvider>
      </div>
    );
  }
}

export default App;