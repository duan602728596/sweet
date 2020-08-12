import { Layout } from 'antd';
import style from './index.sass';

/**
 * layout - footer
 * 网站底部
 */
function Footer(props) {
  return (
    <Layout.Footer className={ style.footer }>
      Copy Right
    </Layout.Footer>
  );
}

export default Footer;