/* babel-loader 配置 */
import path from 'path';

// 默认插件
const presetsList: Function = (presets: Array = [], debug: boolean, isReact: boolean, ecmascript: boolean): Array=>{
  const list: [] = [
    '@babel/preset-flow',
    ...presets
  ];

  // 判断是否加载react相关插件
  if(isReact){
    list.unshift('@babel/preset-react');
  }

  // 判断是否为es6+
  if(!ecmascript){
    list.unshift([
      '@babel/preset-env',
      {
        targets: { ie: 11, edge: 16, chrome: 62, firefox: 56 },
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

  // 判断是否加载react相关插件，热替换
  if(isReact){
    list.push('react-hot-loader/babel');
  }

  if(ecmascript){
    list.unshift('@babel/plugin-proposal-object-rest-spread');
  }

  return list;
};

export default function(options: Object = {}, sweetOptions: Object): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * ecmascript { boolean }: 是否编译到ecmascript的最新语法
   * presets { ?Array }: 插件列表
   * plugins { ?Array }: 插件列表
   * resetPresets { ?Array }: 插件覆盖列表
   * resetPlugins { ?Array }: 插件覆盖列表
   * reactHotLoader { boolean }: 开启react-hot-loader
   */
  const { isDevelopment, ecmascript, presets, plugins, resetPresets, resetPlugins, isReact }: {
    isDevelopment: boolean,
    presets: ?Array,
    plugins: ?Array,
    resetPresets: ?Array,
    resetPlugins: ?Array,
    isReact: boolean
  } = options;
  const debug: boolean = isDevelopment === undefined ? true : isDevelopment;
  const babelLoaderOptions: Object = {
    cacheDirectory: path.join(sweetOptions.basicPath, '.babelCache'),
    presets: resetPresets ? resetPresets : presetsList(presets, debug, isReact, ecmascript),
    plugins: resetPlugins ? resetPlugins : pluginsList(plugins, isReact, ecmascript)
  };

  return {
    loader: 'babel-loader',
    options: babelLoaderOptions
  };
}