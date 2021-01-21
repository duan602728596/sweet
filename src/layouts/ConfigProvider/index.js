import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';

/**
 * 本地化组件
 */
export default {
  render() {
    return (
      <ConfigProvider locale={ zhCN }>
        { this.$slots.default() }
      </ConfigProvider>
    );
  }
};