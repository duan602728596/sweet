/* babel-loader 配置 */
import * as path from 'path';
import { SweetOptions, LoaderOption } from '../utils/types';

// 默认插件
const presetsList: Function = (
  presets: Array<any> = [],
  debug: boolean,
  frame: string,
  ecmascript: boolean
): Array<any> => {
  const list: Array<any> = [
    '@babel/preset-flow',
    ...presets
  ];

  // 判断是否加载react相关插件
  if (frame === 'react') {
    list.unshift('@babel/preset-react');
  }

  // 判断是否为es6+
  if (!ecmascript) {
    list.unshift([
      '@babel/preset-env',
      {
        targets: {
          ie: 11,
          edge: 16,
          chrome: 62,
          firefox: 56,
          android: 6,
          ios: 11
        },
        debug,
        modules: false,
        useBuiltIns: 'usage'
      }
    ]);
  }

  return list;
};

const pluginsList: Function = (plugins: Array<any> = [], frame: string, ecmascript: boolean): Array<any> => {
  const list: Array<any> = [
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
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: !ecmascript,
        useESModules: true
      }
    ],
    ...plugins
  ];

  // 判断是否加载react相关插件，热替换
  if (frame === 'react') {
    list.push('react-hot-loader/babel');
  }

  // vue使用jsx
  if (frame === 'vue') {
    list.push('transform-vue-jsx');
  }

  return list;
};

interface JsOption {
  isDevelopment?: boolean;
  frame?: string;
  ecmascript?: boolean;
  presets?: Array<any>;
  plugins?: Array<any>;
  resetPresets?: Array<any>;
  resetPlugins?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
}

interface BabelLoaderOptions {
  cacheDirectory: string;
  presets: Array<any>;
  plugins: Array<any>;
  configFile: boolean;
  babelrc: boolean;
}

export default function(options: JsOption = {}, sweetOptions: SweetOptions): LoaderOption {
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * ecmascript { boolean }: 是否编译到ecmascript的最新语法
   * presets { ?Array }: 插件列表
   * plugins { ?Array }: 插件列表
   * resetPresets { ?Array }: 插件覆盖列表
   * resetPlugins { ?Array }: 插件覆盖列表
   * frame { string } 当前的模式
   */
  const { isDevelopment, ecmascript, presets, plugins, resetPresets, resetPlugins, frame }: JsOption = options;
  const debug: boolean = frame === 'test' ? false : (isDevelopment === undefined ? true : isDevelopment);
  const babelLoaderOptions: BabelLoaderOptions = {
    cacheDirectory: path.join(sweetOptions.basicPath, '.babelCache'),
    presets: resetPresets
      ? resetPresets
      : presetsList(presets, debug, frame, ecmascript),
    plugins: resetPlugins
      ? resetPlugins
      : pluginsList(plugins, frame, ecmascript),
    configFile: false,
    babelrc: false
  };

  return {
    loader: 'babel-loader',
    options: babelLoaderOptions
  };
}