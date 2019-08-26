import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon, Avatar, Dropdown } from 'antd';
import style from './index.sass';

/* header */
function Header(props) {
  const { location } = props;

  // 计算selectedKeys
  function selectKeys() {
    const { pathname } = location;
    const url = pathname === '/' ? '/Index' : pathname;
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
            <Icon type="logout" />
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
        <Menu mode="horizontal" theme="dark" selectedKeys={ [selectKeys()] }>
          <Menu.Item key="index">
            <Link to="/Index">
              <Icon type="home" />
              首页
            </Link>
          </Menu.Item>
          <Menu.Item key="second">
            <Link to="/Second">
              <Icon type="bars" />
              二级页
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

export default withRouter(Header);