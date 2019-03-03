/**
 * 错误捕捉模块
 * 当模块报错时，显示错误
 */
import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Requireable, ReactNodeLike } from 'prop-types';
import style from './style.sass';
import Content from '../Content/index';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
  info: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static propTypes: {
    children: Requireable<Requireable<ReactNodeLike> | Requireable<Array<ReactNodeLike>>[]>;
  } = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.array
    ])
  };

  constructor(): void {
    super(...arguments);

    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }

  componentDidCatch(error: any, info: any): void {
    this.setState({
      hasError: true,
      error,
      info
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Content>
          <h1 className={ style.title }>错误警告：</h1>
          <h2 className={ style.secondTitle }>Error:</h2>
          <pre className={ style.pre }>{ this.state.error.stack }</pre>
          <h2 className={ style.secondTitle }>Info:</h2>
          <pre className={ style.pre }>{ this.state.info.componentStack }</pre>
        </Content>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;