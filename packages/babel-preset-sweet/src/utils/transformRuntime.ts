import type { PluginItem } from '@babel/core' with { 'resolution-mode': 'import' };

/* @babel/plugin-transform-runtime */
function transformRuntime(): Array<PluginItem> {
  return [
    '@babel/plugin-transform-runtime',
    ['babel-plugin-polyfill-corejs3', { method: 'usage-global' }]
  ];
}

export default transformRuntime;