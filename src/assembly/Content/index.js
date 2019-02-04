/**
 * layout - Content
 * 页面内容
 * 组件用于展示页面的内容
 * 默认padding为10px
 *
 * @flow
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import style from './style.sass';
import ErrorBoundary from '../ErrorBoundary/index';

class Content extends Component<{ children: React.Node }>{
  static propTypes: Object = {
    children: PropTypes.oneOfType(PropTypes.node)
  };

  render(): React.Node{
    return (
      <ErrorBoundary>
        <Layout.Content className={ style.content }>
          { this.props.children }
        </Layout.Content>
      </ErrorBoundary>
    );
  }
}

export default Content;