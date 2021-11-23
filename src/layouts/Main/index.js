import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';
import style from './index.sass';

/**
 * layout - main
 * 页面中部内容布局
 * 包含左侧的菜单Sider和右侧的内容Content
 */
export default defineComponent({
  render(a) {
    const { $slots } = a;

    return (
      <Layout class={ style.main }>
        { $slots.default() }
      </Layout>
    );
  }
});