import type { PluginItem } from '@babel/core';

/* @babel/preset-typescript */
function presetTypescript(): PluginItem {
  return ['@babel/preset-typescript', {
    isTSX: true,
    allExtensions: true,
    allowNamespaces: true,
    optimizeConstEnums: true
  }];
}

export default presetTypescript;