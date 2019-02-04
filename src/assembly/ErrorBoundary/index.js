/**
 * 错误捕捉模块
 * 当模块报错时，显示错误
 *
 * @flow
 */
import * as React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.sass';
import Content from '../Content/index';

class ErrorBoundary extends Component<{ children: React.Node }, { hasError: boolean, error: any, info: any }>{
  static propTypes: Object = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
      PropTypes.element
    ])
  };

  constructor(): void{
    super(...arguments);

    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }
  componentDidCatch(error: any, info: any): void{
    this.setState({
      hasError: true,
      error,
      info
    });
  }
  render(): React.Node{
    if(this.state.hasError){
      return (
        <Content>
          <h1 className={ style.title }>错误警告：</h1>
          <h2 className={ style.secondTitle }>Error:</h2>
          <pre className={ style.pre }>{ this.state.error.stack }</pre>
          <h2 className={ style.secondTitle }>Info:</h2>
          <pre className={ style.pre }>{ this.state.info.componentStack }</pre>
        </Content>
      );
    }else{
      return this.props.children;
    }
  }
}

export default ErrorBoundary;