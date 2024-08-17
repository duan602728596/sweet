/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import style from './index.sass';
import ErrorBoundary from '../ErrorBoundary/index';

function Sider(props) {
  const { options = [] } = props;
  const location = useLocation();

  // 根据pathname获取默认的selectKey
  function getSelectKey(arr) {
    const reg = new RegExp(`^${ location.pathname }.*$`, 'ig');
    let key = undefined;

    for (let i = 0, j = arr.length; i < j; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        const childrenKey = getSelectKey(arr[i].children);

        if (childrenKey) {
          key = childrenKey;
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

  // 渲染菜单
  function menu(arr) {
    return arr.map((item, index) => {
      if (item.children && item.children.length > 0) {
        // 当有children时，返回Menu.SubMenu，里面包裹Menu.Item
        return {
          key: item.id,
          label: item.name,
          icon: item.icon,
          children: menu(item.children)
        };
      } else {
        // 当没有children时，返回Menu.Item
        return {
          key: item.id,
          label: <Link to={ item.url }>{ item.name }</Link>,
          icon: item.icon,
          url: item.url
        };
      }
    });
  }

  return (
    <ErrorBoundary>
      <Layout.Sider className={ style.sider }>
        <Menu style={{ borderRight: 'none' }}
          theme="light"
          mode="inline"
          items={ menu(options) }
          defaultSelectedKeys={ getSelectKey(options) }
        />
      </Layout.Sider>
    </ErrorBoundary>
  );
}

export default Sider;