import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  LogoutOutlined as IconLogoutOutlined,
  HomeOutlined as IconHomeOutlined,
  BarsOutlined as IconBarsOutlined
} from '@ant-design/icons';
import style from './index.sass';

const navItems = [
  {
    key: 'index',
    label: <Link to="/Index">首页</Link>,
    icon: <IconHomeOutlined />
  },
  {
    key: 'second',
    label: <Link to="/Second">二级页</Link>,
    icon: <IconBarsOutlined />
  },
  {
    key: 'list',
    label: <Link to="/List">列表</Link>,
    icon: <IconBarsOutlined />
  }
];

/* header */
function Header(props) {
  const location = useLocation();

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
        <Menu className={ style.menu }
          mode="horizontal"
          theme="dark"
          items={ navItems }
          selectedKeys={ [selectKeys()] }
        />
      </nav>
      {/* 工具 */}
      <div className={ style.tools }>
        <Dropdown menu={ toolsOverlayRender() }>
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