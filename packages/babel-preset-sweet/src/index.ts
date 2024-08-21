import * as process from 'process';
import { moduleExists } from '@sweet-milktea/utils';
import type { PluginItem } from '@babel/core';
import defaultPlugins from './utils/defaultPlugins.js';
import presetEnv from './utils/presetEnv.js';
import type { BabelPresetSweetOptions as Options, BabelPresetSweet, EnvOptions, ReactOptions } from './types.js';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, react }: Options = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules }: EnvOptions = env ?? {},
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
          'last 2 year'
        ]
      };
    }
  }

  const presets: Array<PluginItem> = [];
  const plugins: Array<PluginItem> = [...defaultPlugins];

  // 添加@babel/preset-env
  presets.push(
    presetEnv({
      babelBuildTargets,
      debug,
      envModules
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
  plugins.push([
    'babel-plugin-polyfill-corejs3',
    {
      method: 'usage-pure',
      proposals: true
    }
  ]);

  return { presets, plugins, babelBuildTargets };
}

export default babelPresetSweet;