/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
import PropTypes from 'prop-types';
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
        return (
          <Menu.SubMenu key={ item.id }
            title={
              <span>
                { item.icon }
                <span>{ item.name }</span>
              </span>
            }
          >
            { menu(item.children) }
          </Menu.SubMenu>
        );
      } else {
        // 当没有children时，返回Menu.Item
        return (
          <Menu.Item key={ item.id }>
            <Link to={ item.url }>
              { item.icon }
              <span>{ item.name }</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  return (
    <ErrorBoundary>
      <Layout.Sider className={ style.sider }>
        {
          typeof window === 'object' && (
            <Menu theme="light" mode="inline" defaultSelectedKeys={ getSelectKey(options) } style={{ borderRight: 'none' }}>
              { menu(options) }
            </Menu>
          )
        }
      </Layout.Sider>
    </ErrorBoundary>
  );
}

Sider.propTypes = {
  options: PropTypes.array
};

export default Sider;