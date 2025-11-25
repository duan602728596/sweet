import type { PluginItem } from '@babel/core' with { 'resolution-mode': 'import' };

/* @babel/preset-typescript */
function presetTypescript(): PluginItem {
  return ['@babel/preset-typescript', {
    allowNamespaces: true,
    optimizeConstEnums: true
  }];
}

export default presetTypescript;