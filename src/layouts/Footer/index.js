import React from 'react';
import { Layout } from 'antd';
import style from './index.sass';

function Footer(props) {
  return (
    <Layout.Footer className={ style.footer }>
      Copy Right
    </Layout.Footer>
  );
}

export default Footer;