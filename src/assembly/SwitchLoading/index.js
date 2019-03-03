/**
 * 异步加载时显示loading
 */
import * as React from 'react';
import { Component } from 'react';
import { Spin } from 'antd';
import Main from '../Main/index';
import style from './style.sass';

class SwitchLoading extends Component<{}> {
  render(): React.ReactNode {
    return (
      <Main>
        <div className={ style.loading }>
          <Spin size="large" tip="Loading..." />
        </div>
      </Main>
    );
  }
}

export default SwitchLoading;