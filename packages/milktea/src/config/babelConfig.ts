import * as path from 'path';
import type { LoaderOptions } from 'webpack-chain';
import { babelCache } from './cacheConfig';
import type { SweetOptions, JS } from '../utils/types';

/* babel-loader配置 */

// babel plugins
export function createBabelPlugins(): Array<any> {
  return [
    ['@babel/plugin-proposal-decorators', { legacy: true }],               // 修饰器
    '@babel/plugin-proposal-class-static-block',                           // class static块
    '@babel/plugin-proposal-class-properties',                             // class 相关
    '@babel/plugin-proposal-do-expressions',                               // do {} 语法
    '@babel/plugin-proposal-export-default-from',                          // export module from 语法
    '@babel/plugin-proposal-export-namespace-from',                        // export * as module from 语法
    '@babel/plugin-proposal-numeric-separator',                            // 数字分隔符
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }], // 管道函数
    '@babel/plugin-proposal-throw-expressions',                            // var e = throw new Error(err) 语法
    '@babel/plugin-syntax-module-string-names',                            // import { 'unicode' as bar } and export { foo as 'unicode' }
    '@babel/plugin-syntax-top-level-await'                                 // top-level await
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

// @babel/preset-env node targets
export function createNodeTargets(): { browsers: Array<string> } {
  return {
    browsers: ['node 10']
  };
}

/**
 * @babel/preset-typescript
 * @param { boolean } isReact: react下使用React，vue下保持原输出
 */
export function createPresetTypescript(isReact: boolean = true): Array<any> {
  return [
    '@babel/preset-typescript',
    {
      isTSX: true,
      jsxPragma: isReact ? 'React' : 'Preserve',
      allExtensions: true,
      allowNamespaces: true
    }
  ];
}

/**
 * @babel/preset-env
 * @param { object | undefined } customTargets: 自定义@babel/preset-env的编译目标
 * @param { boolean } debug: 是否debug
 * @param { boolean } notUseBuiltIns: 不使用core-js
 */
export function createPresetEnv(customTargets: object | undefined, debug: boolean, notUseBuiltIns?: boolean): Array<any> {
  const options: { [key: string]: any } = {
    targets: customTargets ?? createTargets(),
    debug,
    modules: false,
    useBuiltIns: notUseBuiltIns ? false : 'usage',
    bugfixes: true
  };

  if (!notUseBuiltIns) {
    options.corejs = 3;
  }

  return ['@babel/preset-env', options];
}

/**
 * @babel/preset-env node
 * @param { object | undefined } customTargets: 自定义@babel/preset-env的编译目标
 * @param { boolean } debug: 是否debug
 * @param { boolean } notUseBuiltIns: 不使用core-js
 */
export function createPresetEnvInNode(customTargets: object | undefined, debug: boolean, notUseBuiltIns?: boolean): Array<any> {
  const options: { [key: string]: any } = {
    targets: customTargets ?? createNodeTargets(),
    debug,
    modules: false,
    useBuiltIns: notUseBuiltIns ? false : 'usage',
    bugfixes: true
  };

  if (!notUseBuiltIns) {
    options.corejs = 3;
  }

  return ['@babel/preset-env', options];
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
    presets: resetPresets ?? [],
    plugins: resetPlugins ?? [
      ...createBabelPlugins(),
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: { version: 3, proposals: true },
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
 * ts-loader options
 * @param { string | undefined } configFile
 */
export function createTypescriptOptions(configFile: string | undefined): LoaderOptions {
  const options: LoaderOptions = { transpileOnly: true };

  if (configFile) {
    options.configFile = configFile;
  }

  return options;
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