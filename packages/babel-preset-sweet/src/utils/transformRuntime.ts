import type { PluginItem } from '@babel/core';
import { requireCommonjsModule } from '@sweet-milktea/utils';

/* @babel/plugin-transform-runtime */
function transformRuntime(): Array<PluginItem> {
  return [
    '@babel/plugin-transform-runtime',
    [
      'babel-plugin-polyfill-corejs3',
      {
        method: 'usage-global',
        version: requireCommonjsModule('core-js').version
      }
    ]
  ];
}

export default transformRuntime;