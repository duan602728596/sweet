import type { PluginItem } from '@babel/core';

interface TransformRuntimeOptionsArgs {
  ecmascript?: boolean;
  nodeEnv?: boolean;
  polyfill?: boolean;
}

/* @babel/plugin-transform-runtime */
function transformRuntime(options: TransformRuntimeOptionsArgs): PluginItem {
  const { ecmascript, nodeEnv, polyfill }: TransformRuntimeOptionsArgs = options;

  if (polyfill) {
    return '@babel/plugin-transform-runtime';
  }

  return [
    '@babel/plugin-transform-runtime',
    {
      corejs: { version: 3, proposals: true },
      helpers: true,
      regenerator: !(nodeEnv || ecmascript)
    }
  ];
}

export default transformRuntime;