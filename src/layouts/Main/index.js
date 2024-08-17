/**
 * layout - main
 * 页面中部内容布局
 * 包含左侧的菜单Sider和右侧的内容Content
 */
import { Layout } from 'antd';
import style from './index.sass';

function Main(props) {
  return (
    <Layout className={ style.main }>
      { props.children }
    </Layout>
  );
}

export default Main;