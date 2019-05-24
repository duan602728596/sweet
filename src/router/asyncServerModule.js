/**
 * 异步加载模块，用于服务端渲染，兼容浏览器端渲染
 */
import React from 'react';
import Loadable from 'react-loadable';
import { injectReducers } from '../store/store';
import SwitchLoading from '../layouts/SwitchLoading/index';

/**
 * 异步加载、注入模块和reducer
 * @param { Function } loader: 需要异步注入的模块
 */
function asyncModule(loader) {
  return Loadable({
    loader,
    loading: () => <SwitchLoading />,
    render(Module) {
      const AsyncModule = Module.default;

      return <AsyncModule injectReducers={ injectReducers } />;
    }
  });
}

export default asyncModule;