/**
 * 异步加载时显示loading
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import Main from '../Main/index';
import style from './index.sass';

class Loading extends Component {
  render() {
    return (
      <Main>
        <div className={ style.loadingBox }>
          <div className={ style.loading }>
            <Spin size="large" tip="Loading..." />
          </div>
        </div>
      </Main>
    );
  }
}

export default Loading;