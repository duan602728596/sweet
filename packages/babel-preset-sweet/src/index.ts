import * as process from 'process';
import { defaultPlugins, moduleExists } from './utils';
import type {
  BabelPresetSweetOptions as Options,
  BabelPresetSweet,
  EnvOptions,
  ReactOptions,
  TypescriptOptions
} from './types';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, typescript, react }: Options = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules, useBuiltIns }: EnvOptions = env ?? {},
    { use: useTypescript, isReact = true }: TypescriptOptions = typescript ?? {},
    { use: useReact = true, runtime, development }: ReactOptions = react ?? {};
  const presets: Array<any> = [],
    plugins: Array<any> = [
      ...defaultPlugins,
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: { version: 3, proposals: true },
          helpers: true,
          regenerator: nodeEnv || !ecmascript,
          useESModules: true
        }
      ]
    ];

  // 添加@babel/preset-env
  if (!ecmascript) {
    const useBuiltInsValue: string | boolean = useBuiltIns ?? 'usage';
    const options: { [key: string]: any } = {
      targets: customTargets ?? {
        browsers: nodeEnv ? ['node 10'] : [
          'last 2 versions',
          'last 10 Chrome versions',
          'last 1 year',
          'IE 11'
        ]
      },
      debug,
      modules: modules ?? false,
      useBuiltIns: useBuiltInsValue,
      bugfixes: true
    };

    if (useBuiltInsValue) {
      options.corejs = 3;
    }

    presets.push(['@babel/preset-env', options]);
  }

  // 添加@babel/preset-react
  if (useReact) {
    presets.push([
      '@babel/preset-react',
      {
        runtime: runtime ?? moduleExists('react/jsx-runtime') ? 'automatic' : 'classic',
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