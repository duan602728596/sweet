import Main from '../../layouts/Main/index';
import Sider from '../../layouts/Sider/index';
import Content from '../../layouts/Content/index';
import Index from './Second';

/* 配置二、三级导航菜单 */
const options = [
  {
    id: 'page-0',
    name: '导航菜单-0',
    url: '/Second'
  },
  {
    id: 'page-1',
    name: '导航菜单-1',
    url: '/Second/Page1'
  },
  {
    id: 'page-2',
    name: '导航菜单-2',
    icon: 'folder-open',
    children: [
      {
        id: 'page-2-0',
        name: '子导航-2-0',
        url: '/Second/Page2'
      },
      {
        id: 'page-2-1',
        name: '子导航-2-1',
        url: '/Second/Page3'
      }
    ]
  }
];

export default {
  metaInfo: {
    title: 'Webpack App - second'
  },

  render() {
    return (
      <Main>
        <Sider options={ options } />
        <Content>
          <Index />
        </Content>
      </Main>
    );
  }
};