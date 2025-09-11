import { useMemo, type ReactElement } from 'react';
import { Link, useLocation, type Location } from 'react-router';
import { Menu } from 'antd';
import type { MenuItemType, SubMenuType } from 'rc-menu/es/interface';
import {
  FireOutlined as IconFireOutlined,
  DeploymentUnitOutlined as IconDeploymentUnitOutlined,
  PartitionOutlined as IconPartitionOutlined
} from '@ant-design/icons';
import style from './slideMenu.sass';

/* 路由配置 */
interface NavItem {
  id: string;
  url: string;
  name: string;
  icon?: ReactElement;
  children?: Array<NavItem>;
}

const navs: Array<NavItem> = [
  {
    id: 'sweet',
    url: '/Sweet',
    name: 'sweet',
    icon: <IconFireOutlined className={ style.marginRight10 } />,
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
    icon: <IconDeploymentUnitOutlined className={ style.marginRight10 } />
  },
  {
    id: 'packages',
    url: '/Packages',
    name: 'Packages',
    icon: <IconPartitionOutlined className={ style.marginRight10 } />,
    children: [
      {
        id: 'packages/milktea',
        url: '/Packages/Milktea',
        name: 'milktea'
      },
      {
        id: 'packages/milkteavite',
        url: '/Packages/MilkteaVite',
        name: 'milktea-vite'
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
const openKeys: Array<string> = navs.map((o: NavItem): string => o.id);

function navItemsRender(items: Array<NavItem>): Array<MenuItemType | SubMenuType> {
  const menuItems: Array<MenuItemType | SubMenuType> = [];

  for (const item of items) {
    const { id, url, name, icon, children }: NavItem = item;

    if (children?.length) {
      const childrenMenuItems: Array<MenuItemType | SubMenuType> = navItemsRender(children);

      menuItems.push({
        type: 'submenu',
        label: <span>{ icon }{ name }</span>,
        children: childrenMenuItems,
        key: id
      });
    } else {
      menuItems.push({
        type: 'item',
        label: (
          <Link to={ url }>
            { icon }
            { name }
          </Link>
        ),
        key: id
      });
    }
  }

  return menuItems;
}

/* 网站菜单 */
function SlideMenu(props: {}): ReactElement {
  const location: Location = useLocation();
  const selectedKey: string = useMemo(
    (): string => location.pathname.toLocaleLowerCase().replace(/^\//, ''),
    [location.pathname]);

  return (
    <Menu className={ style.menu }
      mode="inline"
      items={ navItemsRender(navs) }
      defaultOpenKeys={ openKeys }
      selectedKeys={ [selectedKey] }
    />
  );
}

export default SlideMenu;