import Vue from 'vue';
import Component from 'vue-class-component';
import Main from '../../layouts/Main/index';
import Sider from '../../layouts/Sider/index';
import Content from '../../layouts/Content/index';

/* 配置二、三级导航菜单 */
const options = [
  {
    id: 's1',
    name: '导航菜单1',
    url: '/Page/S1'
  },
  {
    id: 's2',
    name: '导航菜单2',
    url: '/Page/S2'
  },
  {
    id: 's3',
    name: '导航菜单3',
    children: [
      {
        id: 'c31',
        name: '子导航1',
        url: '/Page/S3/C1'
      },
      {
        id: 'c32',
        name: '子导航2',
        url: '/Page/S3/C2'
      }
    ]
  }
];

@Component({
  metaInfo: {
    title: 'Page'
  }
})
class ModuleLayout extends Vue {
  data() {
    return {
      options
    };
  }

  render() {
    return (
      <Main>
        <Sider options={ this.options } />
        <Content>
          <div>{ this.$store.getters['page/getText']() }</div>
        </Content>
      </Main>
    );
  }
}

export default ModuleLayout;