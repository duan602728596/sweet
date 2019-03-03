/**
 * layout - Content
 * 页面内容
 * 组件用于展示页面的内容
 * 默认padding为10px
 */
import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Requireable, ReactNodeLike } from 'prop-types';
import { Layout } from 'antd';
import style from './style.sass';
import ErrorBoundary from '../ErrorBoundary/index';

interface ContextProps {
  children: React.ReactNode;
}

class Content extends Component<ContextProps> {
  static propTypes: {
    children: Requireable<Requireable<ReactNodeLike> | Requireable<Array<ReactNodeLike>>[]>;
  } = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.array
    ])
  };

  render(): React.ReactNode {
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