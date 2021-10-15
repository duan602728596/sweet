import { useMemo, useCallback, ReactElement, ReactNodeArray } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Location } from 'history';
import { Menu } from 'antd';
import {
  FireOutlined as IconFireOutlined,
  DeploymentUnitOutlined as IconDeploymentUnitOutlined,
  PartitionOutlined as IconPartitionOutlined
} from '@ant-design/icons';
import style from './slideMenu.sass';

const { Item: MenuItem, SubMenu }: typeof Menu = Menu;

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

/* 网站菜单 */
function SlideMenu(props: {}): ReactElement {
  const location: Location = useLocation();
  const selectedKey: string = useMemo(
    (): string => location.pathname.toLocaleLowerCase().replace(/^\//, ''),
    [location.pathname]);

  // 渲染菜单
  const navRender: (n: NavItem[]) => ReactNodeArray = useCallback(function(navsList: Array<NavItem>): ReactNodeArray {
    const element: Array<ReactElement> = [];

    for (const item of navsList) {
      const { id, url, name, icon, children }: NavItem = item;

      if (children?.length) {
        const childrenElement: ReactNodeArray = navRender(children);

        element.push(
          <SubMenu key={ id } title={ <span>{ icon }{ name }</span> }>
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
  }, []);

  return (
    <Menu className={ style.menu } mode="inline" defaultOpenKeys={ openKeys } selectedKeys={ [selectedKey] }>
      { navRender(navs) }
    </Menu>
  );
}

export default SlideMenu;