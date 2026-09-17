import type { PluginItem } from '@babel/core';
import type { Options as BabelPresetEnvOptions } from '@babel/preset-env';
import corejsPackageJson from 'core-js/package.json' with { type: 'json' };

/* @babel/plugin-transform-runtime */
function transformRuntime(targets: BabelPresetEnvOptions['targets']): Array<PluginItem> {
  return [
    '@babel/plugin-transform-runtime',
    [
      'babel-plugin-polyfill-corejs3',
      {
        method: 'usage-global',
        targets,
        corejs: corejsPackageJson.version
      }
    ]
  ];
}

export default transformRuntime;