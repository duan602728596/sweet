import Vue from 'vue';
import Component from 'vue-class-component';
import { Layout, Menu } from 'ant-design-vue';
import style from './style.sass';

/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
@Component({
  props: {
    options: Array
  }
})
class Sider extends Vue {
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
  }

  optionsView(options, fatherIndex) {
    return options.map((item, index) => {
      if (item.children && item.children.length > 0) {
        const children = this.optionsView(item.children, index);

        return (
          <Menu.SubMenu key={ item.id } name={ `submenu${ fatherIndex ? `-${ fatherIndex }` : '' }-${ index }` }>
            <template slot="title">{ item.name }</template>
            { children }
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={ item.id } name={ `item${ fatherIndex ? `-${ fatherIndex }` : '' }-${ index }` }>
            <router-link class={ style.link } to={ item.url }>{ item.name }</router-link>
          </Menu.Item>
        );
      }
    });
  }

  render() {
    const options = this.$props.options;
    const sk = this.getSelectKey(options);

    return (
      <Layout.Sider class={ style.sider } width="180">
        <Menu theme="light" mode="inline" defaultSelectedKeys={ sk } style={{ borderRight: 'none' }}>
          { this.optionsView(this.$props.options) }
        </Menu>
      </Layout.Sider>
    );
  }
}

export default Sider;