import Vue from 'vue';
import Component from 'vue-class-component';
import { Layout as AntdLayout } from 'ant-design-vue';
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
@Component
class Layout extends Vue {
  render() {
    return (
      <AntdLayout class={ style.layout }>
        <Header />
        <router-view />
        <Footer />
      </AntdLayout>
    );
  }
}

export default Layout;