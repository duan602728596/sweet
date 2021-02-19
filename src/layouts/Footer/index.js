import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';
import style from './index.sass';

/**
 * layout - footer
 * 底部footer布局
 * 显示版权
 */
export default defineComponent({
  render() {
    return (
      <Layout.Footer class={ style.footer }>
        Copy Right
      </Layout.Footer>
    );
  }
});