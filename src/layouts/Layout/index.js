import { Layout } from 'ant-design-vue';
import ConfigProvider from '../../layouts/ConfigProvider';
import Header from '../Header/index';
import Footer from '../Footer/index';
import style from './index.sass';

/**
 * Arrangement
 * 页面整体布局
 * Header 显示页面header
 * Footer 显示版权信息
 * Routers 根据路由渲染页面
 */
export default {
  render() {
    return (
      <Layout class={ style.layout }>
        <Header />
        <router-view />
        <Footer />
      </Layout>
    );
  }
};