import { SweetOptions } from './types';

interface RegisterConfig {
  presets: Array<any>;
  plugins: Array<any>;
  cache: boolean;
  ignore: Array<RegExp>;
  extensions: Array<string>;
}

/* @babel/register的配置 */
function createRegisterConfig(): RegisterConfig {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { browsers: ['node 10'] },
          debug: false,
          modules: 'commonjs',
          useBuiltIns: 'usage',
          corejs: 3,
          bugfixes: true
        }
      ],
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true,
          allowNamespaces: true,
          onlyRemoveTypeImports: true
        }
      ]
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],               // 修饰器
      '@babel/plugin-proposal-class-properties',                             // class 相关
      '@babel/plugin-proposal-do-expressions',                               // do {} 语法
      '@babel/plugin-proposal-export-default-from',                          // export module from 语法
      '@babel/plugin-proposal-nullish-coalescing-operator',                  // x ?? y 语法
      '@babel/plugin-proposal-numeric-separator',                            // 1_000_000 语法
      '@babel/plugin-proposal-optional-chaining',                            // x?.y 语法
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }], // 管道函数
      '@babel/plugin-proposal-throw-expressions',                            // var e = throw new Error(err) 语法
      '@babel/plugin-syntax-bigint',                                         // BigInt数据类型
      '@babel/plugin-syntax-dynamic-import',                                 // import() 语法
      '@babel/plugin-syntax-top-level-await',                                // top-level await
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: { version: 3, proposals: true },
          helpers: true,
          regenerator: false,
          useESModules: true
        }
      ]
    ],
    cache: true,
    ignore: [/node_modules/],
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.tsx', '.ts']
  };
}

/* 使用@babel/register */
function useRegister(sweetOptions: SweetOptions): void {
  if (sweetOptions.useBabelRegister) {
    const config: RegisterConfig = createRegisterConfig();

    // 如果开启了ssr，要把编译后的目录加入到忽略列表，否则会影响性能
    if (sweetOptions.serverRenderRoot) {
      config.ignore.push(new RegExp(sweetOptions.serverRenderRoot, 'ig'));
    }

    require('@babel/register')(config);
  }
}

export default useRegister;