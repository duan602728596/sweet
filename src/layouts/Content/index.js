import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';
import style from './style.sass';

/**
 * layout - Content
 * 页面内容
 * 组件用于展示页面的内容
 * 默认padding为8px
 */
export default defineComponent({
  render(a) {
    const { $slots } = a;

    return (
      <Layout.Content class={ style.content }>
        { $slots.default() }
      </Layout.Content>
    );
  }
});