/**
 * layout - main
 * 页面中部内容布局
 * 包含左侧的菜单Sider和右侧的内容Content
 */
import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Requireable, ReactNodeLike } from 'prop-types';
import { Layout } from 'antd';
import style from './style.sass';

interface MainProps {
  children: React.ReactNode;
}

class Main extends Component<MainProps> {
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
      <Layout className={ style.main }>
        { this.props.children }
      </Layout>
    );
  }
}

export default Main;