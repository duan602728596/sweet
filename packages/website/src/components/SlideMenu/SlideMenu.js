import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  FireOutlined as IconFireOutlined,
  DeploymentUnitOutlined as IconDeploymentUnitOutlined,
  PartitionOutlined as IconPartitionOutlined
} from '@ant-design/icons';
import style from './slideMenu.sass';

const { Item: MenuItem, SubMenu } = Menu;

/* 路由配置 */
const navs = [
  {
    id: 'sweet',
    url: '/Sweet',
    name: 'sweet',
    icon: <IconFireOutlined />,
    children: [
      {
        id: 'sweet/introduction',
        url: '/Sweet/Introduction',
        name: '介绍'
      },
      {
        id: 'sweet/quickstart',
        url: '/Sweet/QuickStart',
        name: '快速开始'
      }
    ]
  },
  {
    id: 'demo',
    url: '/Demo',
    name: 'Demo',
    icon: <IconDeploymentUnitOutlined />
  },
  {
    id: 'packages',
    url: '/Packages',
    name: 'Packages',
    icon: <IconPartitionOutlined />,
    children: [
      {
        id: 'packages/milktea',
        url: '/Packages/Milktea',
        name: 'milktea'
      },
      {
        id: 'packages/milkteacli',
        url: '/Packages/MilkteaCli',
        name: 'milktea-cli'
      },
      {
        id: 'packages/server',
        url: '/Packages/Server',
        name: 'server'
      },
      {
        id: 'packages/serverlog',
        url: '/Packages/ServerLog',
        name: 'server-log'
      },
      {
        id: 'packages/utiltools',
        url: '/Packages/UtilTools',
        name: 'util-tools'
      },
      {
        id: 'packages/babelpresetsweet',
        url: '/Packages/BabelPresetSweet',
        name: 'babel-preset-sweet'
      }
    ]
  }
];
const openKeys = navs.map((o) => o.id);

/* 网站菜单 */
function SlideMenu(props) {
  const location = useLocation();
  const selectedKey = location.pathname.toLocaleLowerCase().replace(/^\//, '');

  // 渲染菜单
  function navRender(navsList) {
    const element = [];

    for (const item of navsList) {
      const { id, url, name, icon, children } = item;

      if (children?.length) {
        const childrenElement = navRender(children);

        element.push(
          <SubMenu key={ id } title={
            <span>
              { icon }
              { name }
            </span>
          }>
            { childrenElement }
          </SubMenu>
        );
      } else {
        element.push(
          <MenuItem key={ id }>
            <Link to={ url }>
              { icon }
              { name }
            </Link>
          </MenuItem>
        );
      }
    }

    return element;
  }

  return (
    <Menu className={ style.menu } mode="inline" defaultOpenKeys={ openKeys } selectedKeys={ [selectedKey] }>
      { navRender(navs) }
    </Menu>
  );
}

export default SlideMenu;