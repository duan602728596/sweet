/* babel-loader 配置 */
import path from 'path';
import process from 'process';

// 默认插件
const presetsList: Function = (presets: Array = [], debug: boolean, isReact: boolean, ecmascript: boolean): Array=>{
  const list: [] = [
    '@babel/preset-flow',
    ...presets
  ];

  if(isReact){
    list.unshift('@babel/preset-react');
  }

  if(!ecmascript){
    list.unshift([
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
    ]);
  }

  return list;
};

const pluginsList: Function = (plugins: Array = [], isReact: boolean, ecmascript: boolean): Array=>{
  const list: [] = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    ...plugins
  ];

  if(isReact){
    list.push('react-hot-loader/babel');
  }

  if(ecmascript){
    lish.unshift('@babel/plugin-proposal-object-rest-spread');
  }

  return list;
};

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * ecmascript { boolean }: 是否编译到ecmascript的最新语法
   * presets { ?Array }: 插件列表
   * plugins { ?Array }: 插件列表
   * otherPresets { ?Array }: 插件覆盖列表
   * otherPlugins { ?Array }: 插件覆盖列表
   * reactHotLoader { boolean }: 开启react-hot-loader
   */
  const { isDevelopment, ecmascript, presets, plugins, otherPresets, otherPlugins, isReact }: {
    isDevelopment: boolean,
    presets: ?[],
    plugins: ?[],
    otherPresets: ?[],
    otherPlugins: ?[],
    isReact: boolean
  } = options;
  const debug: boolean = isDevelopment === undefined ? true : isDevelopment;
  const babelLoaderOptions: Object = {
    cacheDirectory: path.join(process.cwd(), '.babelCache'),
    presets: otherPresets ? otherPresets : presetsList(presets, debug, isReact, ecmascript),
    plugins: otherPlugins ? otherPlugins : pluginsList(plugins, isReact, ecmascript)
  };

  return {
    loader: 'babel-loader',
    options: babelLoaderOptions
  };
}