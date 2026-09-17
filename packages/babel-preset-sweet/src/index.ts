import * as process from 'process';
import { declarePreset } from '@babel/helper-plugin-utils';
import type { PluginItem, PresetItem, PresetAPI } from '@babel/core';
import type { Options as BabelPresetEnvOptions } from '@babel/preset-env';
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

function hasJsxRuntime(): boolean {
  try {
    import.meta.resolve('react/jsx-runtime');

    return true;
  } catch {
    return false;
  }
}

function babelPresetSweet(api: PresetAPI, options: IBabelPresetSweetOptions | undefined, dirname: string): IBabelPresetSweet {
  const { env, react, typescript }: IBabelPresetSweetOptions = options ?? {};
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

  const presets: Array<PresetItem> = [];
  const plugins: Array<PluginItem> = defaultPlugins.concat(transformRuntime(babelBuildTargets));

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
        runtime: runtime ?? (hasJsxRuntime() ? 'automatic' : 'classic'),
        development: development ?? isDevelopment
      }
    ]);
  }

  return { presets, plugins };
}

export default declarePreset(babelPresetSweet);