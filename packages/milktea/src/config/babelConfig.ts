import * as path from 'path';
import { LoaderOptions } from 'webpack-chain';
import { babelCache } from './cacheConfig';
import { SweetOptions, JS } from '../utils/types';

/* babel-loader配置 */
// babel plugins
export function createBabelPlugins(): Array<any> {
  return [
    ['@babel/plugin-proposal-decorators', { legacy: true }], // 修饰器
    '@babel/plugin-proposal-class-properties',               // class 相关
    '@babel/plugin-proposal-do-expressions',                 // do {} 语法
    '@babel/plugin-proposal-export-default-from',            // export module from 语法
    '@babel/plugin-proposal-nullish-coalescing-operator',    // x ?? y 语法
    '@babel/plugin-proposal-numeric-separator',              // 1_000_000 语法
    '@babel/plugin-proposal-optional-catch-binding',         // try {} catch {} 语法
    '@babel/plugin-proposal-optional-chaining',              // x?.y 语法
    '@babel/plugin-syntax-bigint',                           // BigInt数据类型
    '@babel/plugin-syntax-dynamic-import'                    // import() 语法
  ];
}

// @babel/preset-env targets
export function createTargets(): { browsers: Array<string> } {
  return {
    browsers: [
      'last 2 versions',
      'last 10 Chrome versions',
      'last 1 year',
      'IE 11'
    ]
  };
}

/**
 * @babel/preset-env
 * @param { object | undefined } customTargets: 自定义@babel/preset-env的编译目标
 * @param { boolean } debug: 是否debug
 * @param { boolean } notUseBuiltIns: 不使用core-js
 */
export function createPresetEnv(customTargets: object | undefined, debug: boolean, notUseBuiltIns?: boolean): Array<any> {
  return [
    '@babel/preset-env',
    {
      targets: customTargets ? customTargets : createTargets(),
      debug,
      modules: false,
      useBuiltIns: notUseBuiltIns ? false : 'usage',
      corejs: notUseBuiltIns ? undefined : 3
    }
  ];
}

/**
 * babel-loader options
 * @param { SweetOptions } sweetOptions
 * @param { JS } jsOptions: js配置
 */
export function createBabelOptions(sweetOptions: SweetOptions, jsOptions: JS): LoaderOptions {
  const { ecmascript, resetPresets, resetPlugins }: JS = jsOptions;

  return {
    cacheDirectory: path.join(sweetOptions.basicPath, babelCache),
    presets: resetPresets ? resetPresets : [],
    plugins: resetPlugins ? resetPlugins : [
      ...createBabelPlugins(),
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: {
            version: 3,
            proposals: true
          },
          helpers: true,
          regenerator: !ecmascript,
          useESModules: true
        }
      ]
    ],
    configFile: false,
    babelrc: false
  };
}

/**
 * babel-loader for typescript
 * @param { SweetOptions } sweetOptions
 */
export function createBabelForTsOptions(sweetOptions: SweetOptions): LoaderOptions {
  return {
    cacheDirectory: path.join(sweetOptions.basicPath, babelCache),
    presets: [],
    plugins: [],
    configFile: false,
    babelrc: false
  };
}