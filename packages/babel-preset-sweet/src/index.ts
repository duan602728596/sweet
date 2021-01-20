import { defaultPlugins, moduleExists } from './utils';
import type {
  BabelPresetSweetOptions as Options,
  BabelPresetSweet,
  EnvOptions,
  ReactOptions,
  TypescriptOptions
} from './types';

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, typescript, react }: Options = options;
  const { isNode, ecmascript, targets: customTargets, debug = false, useBuiltIns }: EnvOptions = env ?? {};
  const { use: useTypescript, isReact = true }: TypescriptOptions = typescript ?? {};
  const { use: useReact = true, runtime, development = false }: ReactOptions = react ?? {};

  const plugins: Array<any> = [
    ...defaultPlugins,
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: { version: 3, proposals: true },
        helpers: true,
        regenerator: isNode || !ecmascript,
        useESModules: true
      }
    ]
  ];
  const presets: Array<any> = [];

  // 添加@babel/preset-env
  if (!ecmascript) {
    const options: { [key: string]: any } = {
      targets: customTargets ?? {
        browsers: isNode ? ['node 10'] : [
          'last 2 versions',
          'last 10 Chrome versions',
          'last 1 year',
          'IE 11'
        ],
        debug,
        modules: false,
        useBuiltIns: useBuiltIns ?? 'usage',
        bugfixes: true
      }
    };

    if (useBuiltIns !== false) {
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
        development
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