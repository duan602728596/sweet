/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Requireable } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, Menu } from 'antd';
import style from './style.sass';
import ErrorBoundary from '../ErrorBoundary/index';

@withRouter
class Sider extends Component {
  static defaultProps = {
    options: []
  };
  static propTypes = {
    options: PropTypes.array
  };

  // 根据pathname获取默认的selectKey
  getSelectKey(arr) {
    const reg = new RegExp(`^${ this.props.location.pathname }.*$`, 'ig');
    let key = undefined;

    for (let i = 0, j = arr.length; i < j; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        const childrenKey = this.getSelectKey(arr[i].children);

        if (childrenKey) {
          key = [childrenKey];
          break;
        }
      } else {
        if (reg.test(arr[i].url)) {
          key = [arr[i].id];
          break;
        }
      }
    }

    return key;
  }

  // 判断图标的显示
  hasIcon(item) {
    if ('icon' in item) {
      return typeof item.icon === 'string' ? <i className={ classNames(style.icon, item.icon) } /> : item.icon;
    } else {
      return null;
    }
  }

  // 渲染菜单
  menu(arr) {
    return arr.map((item, index) => {
      if (item.children && item.children.length > 0) {
        // 当有children时，返回Menu.SubMenu，里面包裹Menu.Item
        return (
          <Menu.SubMenu key={ item.id } title={
            <span className="clearfix">
              { this.hasIcon(item) }
              <span>{ item.name }</span>
            </span>
          }>
            { this.menu(item.children) }
          </Menu.SubMenu>
        );
      } else {
        // 当没有children时，返回Menu.Item
        return (
          <Menu.Item key={ item.id }>
            <Link to={ item.url }>
              { this.hasIcon(item) }
              <span>{ item.name }</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  render() {
    const options = this.props.options;
    const sk = this.getSelectKey(options);

    return (
      <ErrorBoundary>
        <Layout.Sider className={ style.sider } width={ 180 }>
          <Menu theme="light" mode="inline" defaultSelectedKeys={ sk } style={{ borderRight: 'none' }}>
            { this.menu(options) }
          </Menu>
        </Layout.Sider>
      </ErrorBoundary>
    );
  }
}

export default Sider;