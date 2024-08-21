import * as process from 'process';
import { moduleExists } from '@sweet-milktea/utils';
import type { PluginItem } from '@babel/core';
import defaultPlugins from './utils/defaultPlugins.js';
import presetEnv from './utils/presetEnv.js';
import transformRuntime from './utils/transformRuntime.js';
import type { BabelPresetSweetOptions as Options, BabelPresetSweet, EnvOptions, ReactOptions } from './types.js';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, react, polyfill }: Options = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules, useBuiltIns }: EnvOptions = env ?? {},
    { use: useReact = true, runtime, development }: ReactOptions = react ?? {};
  const envModules: string | boolean = modules ?? false; // @babel/preset-env的模块类型

  // 编译目标
  let babelBuildTargets: object;

  if (customTargets) {
    babelBuildTargets = customTargets;
  } else {
    if (ecmascript) {
      babelBuildTargets = {
        browsers: nodeEnv ? ['node 20'] : ['last 5 Chrome versions']
      };
    } else {
      babelBuildTargets = {
        browsers: nodeEnv ? ['node 18'] : [
          'last 10 versions',
          'last 2 year',
          'Edge 16'
        ]
      };
    }
  }

  const presets: Array<PluginItem> = [];
  const plugins: Array<PluginItem> = defaultPlugins.concat([
    transformRuntime({
      ecmascript,
      nodeEnv,
      polyfill
    })
  ]);

  // 添加@babel/preset-env
  presets.push(
    presetEnv({
      babelBuildTargets,
      useBuiltIns,
      debug,
      envModules,
      polyfill
    })
  );

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

  // 添加babel-plugin-polyfill-{name}相关插件
  if (polyfill) {
    plugins.push(
      [
        'babel-plugin-polyfill-corejs3',
        {
          method: 'usage-global',
          targets: babelBuildTargets
        }
      ],
      [
        'babel-plugin-polyfill-es-shims',
        {
          method: 'usage-global',
          targets: babelBuildTargets
        }
      ]
    );
  }

  return { presets, plugins };
}

export default babelPresetSweet;