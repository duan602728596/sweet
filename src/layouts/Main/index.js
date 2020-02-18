import { Layout } from 'ant-design-vue';
import style from './index.sass';

/**
 * layout - main
 * 页面中部内容布局
 * 包含左侧的菜单Sider和右侧的内容Content
 */
export default {
  render() {
    return (
      <Layout class={ style.main }>
        { this.$slots.default }
      </Layout>
    );
  }
};