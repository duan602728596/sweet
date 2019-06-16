import * as path from 'path';
import { SweetOptions, JS } from '../utils/types';

/* babel-loader配置 */
// babel plugins
export function createBabelPlugins(): Array<any> {
  return [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-syntax-bigint',
    '@babel/plugin-syntax-dynamic-import'
  ];
}

// @babel/preset-env targets
export function createTargets(): object {
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
 */
export function createPresetEnv(customTargets: object | undefined, debug: boolean): Array<any> {
  return [
    '@babel/preset-env',
    {
      targets: customTargets ? customTargets : createTargets(),
      debug,
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3
    }
  ];
}

/**
 * babel-loader options
 * @param { SweetOptions } sweetOptions
 * @param { JS } jsOptions: js配置
 */
export function createBabelOptions(sweetOptions: SweetOptions, jsOptions: JS): object {
  const { ecmascript, resetPresets, resetPlugins }: JS = jsOptions;

  return {
    cacheDirectory: path.join(sweetOptions.basicPath, '.sweet/cache/babel'),
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