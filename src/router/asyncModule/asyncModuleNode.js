import React, { useState, useEffect } from 'react';
import { injectReducers } from '../../store/store';
import Loading from '../../layouts/Loading/index';

const map = new Map();

/**
 * 异步加载、注入模块和reducer，用于服务端渲染，兼容浏览器端渲染
 * @param { Function } loader: 需要异步注入的模块
 */
function asyncModuleNode(loader) {
  map.set(loader, null);

  return function() {
    const [loading, setLoading] = useState(false);

    async function loadComponent() {
      setLoading(true);

      const Module = await loader();

      map.set(loader, <Module.default injectReducers={ injectReducers } />);
      setLoading(false);
    }

    useEffect(function() {
      if (!component) {
        loadComponent();
      }
    }, []);

    return loading ? <Loading /> : map.get(loader);
  };
}

export async function preloadAll() {
  const loaders = [], queue = [];

  map.forEach(function(value, key) {
    if (!value) {
      loaders.push(key);
      queue.push(key());
    }
  });

  if (loaders.length > 0) {
    const Modules = await Promise.all(queue);

    for (let i = 0, j = loaders.length; i < j; i++) {
      const Module = Modules[i].default;

      map.set(loaders[i], <Module injectReducers={ injectReducers } />);
    }
  }
}

export default asyncModuleNode;