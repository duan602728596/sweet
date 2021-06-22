import * as process from 'process';
import { moduleExists } from '@sweet-milktea/utils';
import type {
  BabelPresetSweetOptions as Options,
  BabelPresetSweet,
  EnvOptions,
  ReactOptions,
  TypescriptOptions
} from './types';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

/* 默认加载的插件 */
export const defaultPlugins: Array<any> = [
  '@babel/plugin-proposal-async-do-expressions',  // async do {} 语法
  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }], // 修饰器
  '@babel/plugin-proposal-class-static-block',    // class static块
  '@babel/plugin-proposal-class-properties',      // class 相关
  '@babel/plugin-proposal-do-expressions',        // do {} 语法
  '@babel/plugin-proposal-export-default-from',   // export module from 语法
  '@babel/plugin-proposal-export-namespace-from', // export * as module from 语法
  '@babel/plugin-proposal-function-bind',         // obj::func(val) 语法
  '@babel/plugin-proposal-function-sent',         // function* generator() { console.log(function.sent, yield) } 语法
  '@babel/plugin-proposal-numeric-separator',     // 数字分隔符
  '@babel/plugin-proposal-partial-application',   // function add(x, y) { return x + y; } add(1, ?) 语法
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }], // 管道函数
  '@babel/plugin-proposal-throw-expressions',     // var e = throw new Error(err) 语法
  '@babel/plugin-syntax-module-string-names',     // import { 'unicode' as bar } and export { foo as 'unicode' }
  '@babel/plugin-syntax-top-level-await'          // top-level await
];

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, typescript, react }: Options = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules, useBuiltIns }: EnvOptions = env ?? {},
    { use: useTypescript, isReact = true }: TypescriptOptions = typescript ?? {},
    { use: useReact = true, runtime, development }: ReactOptions = react ?? {};
  const envModules: string | boolean = modules ?? false; // @babel/preset-env的模块类型

  const presets: Array<any> = [];
  const plugins: Array<any> = defaultPlugins.concat([
    '@babel/plugin-transform-runtime',
    {
      corejs: { version: 3, proposals: true },
      helpers: true,
      regenerator: !(nodeEnv || ecmascript)
    }
  ]);

  // 添加@babel/preset-env
  if (!ecmascript) {
    const useBuiltInsValue: string | boolean = useBuiltIns ?? 'usage';
    const presetEnvOptions: { [key: string]: any } = {
      targets: customTargets ?? {
        browsers: nodeEnv ? ['node 10'] : [
          'last 2 versions',
          'last 10 Chrome versions',
          'last 1 year',
          'IE 11'
        ]
      },
      debug,
      modules: envModules,
      useBuiltIns: useBuiltInsValue,
      bugfixes: true
    };

    if (useBuiltInsValue) {
      presetEnvOptions.corejs = 3;
    }

    presets.push(['@babel/preset-env', presetEnvOptions]);
  }

  // 添加@babel/preset-react
  if (useReact) {
    presets.push([
      '@babel/preset-react',
      {
        runtime: runtime ?? (moduleExists('react/jsx-runtime') ? 'automatic' : 'classic'),
        development: development ?? isDevelopment
      }
    ]);
  }

  // 添加@babel/preset-typescript
  if (useTypescript) {
    presets.push([
      '@babel/preset-typescript',
      {
        isTSX: true,
        jsxPragma: isReact ? 'React' : 'Preserve',
        allExtensions: true,
        allowNamespaces: true
      }
    ]);
  }

  return { presets, plugins };
}

export default babelPresetSweet;