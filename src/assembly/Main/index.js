import Vue from 'vue';
import Component from 'vue-class-component';
import { Layout } from 'ant-design-vue';
import style from './style.sass';

/**
 * layout - main
 * 页面中部内容布局
 * 包含左侧的菜单Sider和右侧的内容Content
 */
@Component
class Main extends Vue {
  render() {
    return (
      <Layout className={ style.main }>
        { this.$slots.default }
      </Layout>
    );
  }
}

export default Main;