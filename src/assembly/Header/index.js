// @flow
// @jsx this.$createElement
import Vue from 'vue';
import Component from 'vue-class-component';
import { Layout, Icon } from 'ant-design-vue';
import HumanInformation from './HumanInformation';
import style from './style.sass';

type options = {
  id: string;
  name: string;
  href: string;
  icon: string;
};

export const navOptions: options[] = [
  {
    id: 'index',
    name: '主页',
    href: '/Index',
    icon: 'home'
  },
  {
    id: 'page',
    name: '列表',
    href: '/Page',
    icon: 'bars'
  },
  {
    id: 'form',
    name: '表单',
    href: '/Form',
    icon: 'table'
  }
];

/**
 * layout - header
 * 顶部header布局
 * 显示logo、导航、登录人信息等
 */
@Component
class Header extends Vue {
  data(): Object {
    return {
      navOptions
    };
  }

  listView(navOptions: Array<Object>): Vue.VNode {
    return navOptions.map((item: Object, index: number): Vue.VNode => {
      return (
        <li key={ index }>
          <router-link to={ item.href } active-class={ style.navActive }>
            <Icon class={ style.icon } type={ item.icon } theme="outlined" />
            <span>{ item.name }</span>
          </router-link>
        </li>
      );
    });
  }

  render(): Vue.VNode {
    return (
      <Layout.Header class={ style.header }>
        <img class={ style.logo } src={ require('./logo.png') } alt="管理平台 demo" title="管理平台 demo" />
        <nav class={ style.nav }>
          <ul class="clearfix">{ this.listView(navOptions) }</ul>
        </nav>
        <HumanInformation />
      </Layout.Header>
    );
  }
}

export default Header;