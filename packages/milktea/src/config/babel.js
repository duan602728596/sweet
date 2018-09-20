/* babel-loader 配置 */
import path from 'path';
import process from 'process';

// 默认插件
const presetsList: Function = (presets: Array = [], debug: boolean): Array => [
  [
    '@babel/preset-env',
    {
      targets: {
        ie: 11,
        edge: 16,
        chrome: 62,
        firefox: 56
      },
      debug,
      modules: false,
      useBuiltIns: 'usage'
    }
  ],
  '@babel/preset-flow',
  ...presets
];

const pluginsList: Function = (plugins: Array = []): Array => [
  [
    '@babel/plugin-proposal-decorators',
    {
      legacy: true
    }
  ],
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-syntax-dynamic-import',
  ...plugins
];

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * presets { ?Array }: 插件列表
   * plugins { ?Array }: 插件列表
   * otherPresets { ?Array }: 插件覆盖列表
   * otherPlugins { ?Array }: 插件覆盖列表
   */
  const { isDevelopment, presets, plugins, otherPresets, otherPlugins }: {
    isDevelopment: boolean,
    presets: ?[],
    plugins: ?[],
    otherPresets: ?[],
    otherPlugins: ?[]
  } = options;
  const debug: boolean = isDevelopment === undefined ? true : isDevelopment;

  return {
    loader: 'babel-loader',
    options: {
      cacheDirectory: path.join(process.cwd(), './.babelCache'),
      presets: otherPresets ? otherPresets : presetsList(presets, debug),
      plugins: otherPlugins ? otherPlugins : pluginsList(plugins)
    }
  };
}