import type { PluginItem } from '@babel/core';

interface TransformRuntimeOptionsArgs {
  ecmascript?: boolean;
  nodeEnv?: boolean;
}

/* @babel/plugin-transform-runtime */
function transformRuntime(options: TransformRuntimeOptionsArgs): PluginItem {
  const { ecmascript, nodeEnv }: TransformRuntimeOptionsArgs = options;

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