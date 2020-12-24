import { lazy, Suspense } from 'react';
import Loading from '../../layouts/Loading';

/**
 * 异步加载、注入模块和reducer
 * @param { Function } loader: 需要异步注入的模块
 */
function asyncModule(loader) {
  const Module = lazy(loader);

  return () => (
    <Suspense fallback={ <Loading /> }>
      <Module />
    </Suspense>
  );
}

export default asyncModule;