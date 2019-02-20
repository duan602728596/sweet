/**
 * layout - header
 * 顶部header布局
 * 显示logo、导航、登录人信息等
 *
 * @flow
 */
import * as React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from 'antd';
import style from './style.sass';
import ErrorBoundary from '../ErrorBoundary/index';
import HumanInformation from './HumanInformation';

type navOptionsItem = {
  id: string;
  name: string;
  href: string;
  icon: string;
};

export const navOptions: navOptionsItem[] = [
  {
    id: 'home',
    name: '主页',
    href: '/Index',
    icon: 'home'
  },
  {
    id: 'list',
    name: '列表',
    href: '/List',
    icon: 'bars'
  },
  {
    id: 'form',
    name: '表单',
    href: '/Form',
    icon: 'table'
  }
];

const len: boolean = navOptions.length > 0;

class Header extends Component<{}> {
  // 判断首页home
  oddEvent(item: navOptionsItem, match: Object, location: Object): boolean {
    const { pathname }: { pathname: string } = location;
    const { href }: { href: string } = item;
    const reg: RegExp = new RegExp(`^${ href }.*$`, 'ig');

    if (len && pathname === '/' && href === navOptions[0].href) {
      return true;
    }

    return match && reg.test(pathname);
  }

  navList(options: navOptionsItem[]): React.ChildrenArray<React.Node> {
    return options.map((item: navOptionsItem, index: number): Object => {
      return (
        <li key={ item.id }>
          <NavLink to={ item.href } activeClassName={ style.navActive } isActive={ this.oddEvent.bind(this, item) }>
            <Icon className={ style.icon } type={ item.icon } theme="outlined" />
            <span>{ item.name }</span>
          </NavLink>
        </li>
      );
    });
  }

  render(): React.Node {
    return (
      <ErrorBoundary>
        <img className={ style.logo } src={ require('./logo.png') } alt="管理平台 demo" title="管理平台 demo" />
        <nav className={ style.nav }>
          <ul className={ classNames(style.navList, 'clearfix') }>
            { this.navList(navOptions) }
          </ul>
        </nav>
        <HumanInformation />
      </ErrorBoundary>
    );
  }
}

export default Header;