import type { PluginItem } from '@babel/core';

/* @babel/plugin-transform-runtime */
function transformRuntime(): Array<PluginItem> {
  return ['@babel/plugin-transform-runtime'];
}

export default transformRuntime;