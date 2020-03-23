import { defineComponent, createElement as h } from '@vue/composition-api';
import { Layout, Menu, Icon } from 'ant-design-vue';
import style from './index.sass';

/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
export default defineComponent({
  props: {
    options: Array
  },

  setup: () => {
    return {
      // 根据pathname获取默认的selectKey
      getSelectKey(arr) {
        const reg = new RegExp(`^${ this.$router.currentRoute.fullPath }.*$`, 'ig');
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
      },

      optionsView(options, fatherIndex) {
        return options.map((item, index) => {
          if (item.children && item.children.length > 0) {
            const children = this.optionsView(item.children, index);

            return (
              <Menu.SubMenu key={ item.id } name={ item.id }>
                <template slot="title">
                  <span>
                    { item.icon ? <Icon type={ item.icon } /> : null }
                    <span>{ item.name }</span>
                  </span>
                </template>
                { children }
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={ item.id } name={ item.id }>
                <router-link to={ item.url }>
                  { item.icon ? <Icon type={ item.icon } /> : null }
                  <span>{ item.name }</span>
                </router-link>
              </Menu.Item>
            );
          }
        });
      }
    };
  },

  render() {
    const options = this.$props.options;
    const sk = this.getSelectKey(options);

    return (
      <Layout.Sider class={ style.sider }>
        <Menu theme="light" mode="inline" defaultSelectedKeys={ sk } style={{ borderRight: 'none' }}>
          { this.optionsView(options) }
        </Menu>
      </Layout.Sider>
    );
  }
});