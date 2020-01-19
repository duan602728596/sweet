import React, { lazy, Suspense } from 'react';
import Loadable from 'react-loadable';
import { injectReducers } from '../store/store';
import Loading from '../layouts/Loading/index';

/**
 * 异步加载、注入模块和reducer
 * @param { Function } loader: 需要异步注入的模块
 */
function asyncModule(loader) {
  const Module = lazy(loader);

  return () => (
    <Suspense fallback={ <Loading /> }>
      <Module injectReducers={ injectReducers } />
    </Suspense>
  );
}

/**
 * 异步加载、注入模块和reducer，用于服务端渲染，兼容浏览器端渲染
 * @param { Function } loader: 需要异步注入的模块
 */
function asyncModuleNode(loader) {
  return Loadable({
    loader,
    loading: () => <Loading />,
    render(Module) {
      const AsyncModule = Module.default;

      return <AsyncModule injectReducers={ injectReducers } />;
    }
  });
}

export default process.env.SWEET_SERVER_RENDER === true ? asyncModuleNode : asyncModule;