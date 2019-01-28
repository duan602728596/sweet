import Header from '../Header/index';
import Main from '../Main/index';
import style from './style.sass';

/**
 * layout
 * 页面整体布局
 * Header 显示页面header
 * Footer 显示版权信息
 * Routers 根据路由渲染页面
 */
export default {
  name: 'Layout',
  render(): Vue.VNode{
    return (
      <i-layout class={ style.layout }>
        <Header />
        <router-view />
        <i-footer class={ style.footer }>版权所有</i-footer>
      </i-layout>
    );
  }
};