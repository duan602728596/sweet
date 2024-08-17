/**
 * 错误捕捉模块
 * 当模块报错时，显示错误
 */
import { Component } from 'react';
import style from './index.sass';
import Content from '../Content/index';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: undefined,
    info: undefined
  };

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      info
    });
  }

  render() {
    const { props, state } = this;
    const { hasError, error, info } = state;

    if (hasError) {
      return (
        <Content>
          <h1 className={ style.title }>错误警告：</h1>
          <h2 className={ style.secondTitle }>Error:</h2>
          <pre className={ style.pre }>{ error.stack }</pre>
          <h2 className={ style.secondTitle }>Info:</h2>
          <pre className={ style.pre }>{ info.componentStack }</pre>
        </Content>
      );
    } else {
      return props.children;
    }
  }
}

export default ErrorBoundary;