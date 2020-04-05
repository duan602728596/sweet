import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  LogoutOutlined as IconLogoutOutlined,
  HomeOutlined as IconHomeOutlined,
  BarsOutlined as IconBarsOutlined
} from '@ant-design/icons';
import style from './index.sass';

/* header */
function Header(props) {
  const location = useLocation();

  // 计算selectedKeys
  function selectKeys() {
    const { pathname } = location;
    const url = pathname === '/' ? '/Welcome' : pathname;
    const key = url.substr(1)
      .split(/\//g)[0]
      .toLocaleLowerCase();

    return key;
  }

  // 渲染下拉菜单
  function toolsOverlayRender() {
    return (
      <Menu>
        <Menu.Item>
          <Link to="/Login">
            <IconLogoutOutlined />
            退出
          </Link>
        </Menu.Item>
      </Menu>
    );
  }

  return (
    <Layout.Header className={ style.header }>
      {/* logo */}
      <div className={ style.logo }>平台LOGO</div>
      {/* 导航 */}
      <nav className={ style.nav }>
        <Menu className={ style.menu } mode="horizontal" theme="dark" selectedKeys={ [selectKeys()] }>
          <Menu.Item key="index">
            <Link to="/Welcome">
              <IconHomeOutlined />
              首页
            </Link>
          </Menu.Item>
          <Menu.Item key="second">
            <Link to="/Second">
              <IconBarsOutlined />
              二级页
            </Link>
          </Menu.Item>
          <Menu.Item key="list">
            <Link to="/List">
              <IconBarsOutlined />
              列表
            </Link>
          </Menu.Item>
        </Menu>
      </nav>
      {/* 工具 */}
      <div className={ style.tools }>
        <Dropdown overlay={ toolsOverlayRender() }>
          <span className={ style.toolsMenu }>
            <Avatar className={ style.avatar }>D</Avatar>
            <span className={ style.username }>用户名</span>
          </span>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}

export default Header;