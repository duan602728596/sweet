/**
 * layout - Content
 * 页面内容
 * 组件用于展示页面的内容
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import style from './index.sass';
import ErrorBoundary from '../ErrorBoundary/index';

function Content(props) {
  return (
    <ErrorBoundary>
      <Layout.Content className={ style.content }>
        { props.children }
      </Layout.Content>
    </ErrorBoundary>
  );
}

Content.propTypes = {
  children: PropTypes.node
};

export default Content;