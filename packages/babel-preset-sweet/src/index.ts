import * as process from 'process';
import { moduleExists } from '@sweet-milktea/utils';
import defaultPlugins from './utils/defaultPlugins.js';
import presetEnv from './utils/presetEnv.js';
import presetTypescript from './utils/presetTypescript.js';
import transformRuntime from './utils/transformRuntime.js';
import type { BabelPresetSweetOptions as Options, BabelPresetSweet, EnvOptions, ReactOptions, TypescriptOptions } from './types.js';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, react, typescript }: Options = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules }: EnvOptions = env ?? {},
    { use: useTypescript }: TypescriptOptions = typescript ?? {},
    { use: useReact = true, runtime, development }: ReactOptions = react ?? {};
  const envModules: string | boolean = modules ?? false; // @babel/preset-env的模块类型

  // 编译目标
  let babelBuildTargets: object;

  if (customTargets) {
    babelBuildTargets = customTargets;
  } else {
    if (ecmascript) {
      babelBuildTargets = {
        browsers: nodeEnv ? ['node 24'] : ['last 5 Chrome versions']
      };
    } else {
      babelBuildTargets = {
        browsers: nodeEnv ? ['node 20'] : [
          'last 10 versions',
          'last 2 year'
        ]
      };
    }
  }

  const presets: Array<[string, any?] | string> = [];
  const plugins: Array<[string, any?] | string> = defaultPlugins.concat(...transformRuntime());

  // 添加@babel/preset-env
  presets.push(
    presetEnv({
      babelBuildTargets,
      debug,
      envModules
    })
  );

  // 添加@babel/preset-typescript
  if (useTypescript) {
    presets.push(presetTypescript());
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

  return { presets, plugins };
}

export default babelPresetSweet;