import Vue from 'vue';
import Main from '../../assembly/Main/index';
import Sider from '../../assembly/Sider/index';
import Content from '../../assembly/Content/index';

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

export default {
  data() {
    return {
      options
    };
  },
  render() {
    return (
      <Main>
        <helmet-provider>
          <helmet>
            <title>Page</title>
          </helmet>
        </helmet-provider>
        <Sider options={ this.options } />
        <Content>
          <div>Page</div>
        </Content>
      </Main>
    );
  }
};