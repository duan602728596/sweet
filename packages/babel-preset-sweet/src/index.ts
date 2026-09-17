import * as process from 'process';
import type { PluginItem, PresetAPI } from '@babel/core' with { 'resolution-mode': 'import' };
import type { Options as BabelPresetEnvOptions } from '@babel/preset-env';
import { moduleExists } from '@sweet-milktea/utils';
import defaultPlugins from './defaultPlugins.js';
import presetEnv from './presetEnv.js';
import presetTypescript from './presetTypescript.js';
import transformRuntime from './transformRuntime.js';
import type {
  IBabelPresetSweetOptions,
  IBabelPresetSweet,
  IEnvOptions,
  IReactOptions,
  ITypescriptOptions
} from './types.js';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

function babelPresetSweet(api: PresetAPI, options: IBabelPresetSweetOptions = {}, dirname: string): IBabelPresetSweet {
  const { env, react, typescript }: IBabelPresetSweetOptions = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules }: IEnvOptions = env ?? {},
    { use: useTypescript }: ITypescriptOptions = typescript ?? {},
    { use: useReact = true, runtime, development }: IReactOptions = react ?? {};
  const envModules: BabelPresetEnvOptions['modules'] = modules ?? false; // @babel/preset-env的模块类型

  // 编译目标
  let babelBuildTargets: BabelPresetEnvOptions['targets'];

  if (customTargets) {
    babelBuildTargets = customTargets;
  } else {
    if (ecmascript) {
      babelBuildTargets = {
        browsers: nodeEnv ? ['current node'] : ['last 5 Chrome versions']
      };
    } else {
      babelBuildTargets = {
        browsers: nodeEnv ? ['last 3 node versions'] : [
          'last 10 versions',
          'last 2 year'
        ]
      };
    }
  }

  const presets: Array<PluginItem> = [];
  const plugins: Array<PluginItem> = defaultPlugins.concat(transformRuntime());

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