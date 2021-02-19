import { defineComponent } from 'vue';
import { Layout, Menu, Dropdown, Avatar } from 'ant-design-vue';
import { LogoutOutlined as IconLogoutOutlined, HomeOutlined as IconHomeOutlined } from '@ant-design/icons-vue';
import style from './index.sass';

/**
 * layout - header
 * 顶部header布局
 * 显示logo、导航、登录人信息等
 */
export default defineComponent({
  setup() {
    // 渲染下拉菜单
    function toolsOverlayRender() {
      return (
        <Menu>
          <Menu.Item>
            <router-link to="/Login">
              <IconLogoutOutlined />
              退出
            </router-link>
          </Menu.Item>
        </Menu>
      );
    }

    return {
      toolsOverlayRender
    };
  },

  render() {
    return (
      <Layout.Header class={ style.header }>
        {/* logo */}
        <div class={ style.logo }>平台LOGO</div>
        {/* 导航 */}
        <nav class={ style.nav }>
          <Menu mode="horizontal" theme="dark">
            <Menu.Item key="index">
              <router-link to="/Index">
                <IconHomeOutlined />
                首页
              </router-link>
            </Menu.Item>
            <Menu.Item key="second">
              <router-link to="/Second">
                <IconHomeOutlined />
                二级页
              </router-link>
            </Menu.Item>
          </Menu>
        </nav>
        {/* 工具 */}
        <div class={ style.tools }>
          <Dropdown overlay={ this.toolsOverlayRender() }>
            <span class={ style.toolsMenu }>
              <Avatar class={ style.avatar }>D</Avatar>
              <span class={ style.username }>用户名</span>
            </span>
          </Dropdown>
        </div>
      </Layout.Header>
    );
  }
});