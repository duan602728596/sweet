import * as process from 'process';
import { moduleExists } from '@sweet-milktea/utils';
import defaultPlugins from './utils/defaultPlugins';
import presetEnv from './utils/presetEnv';
import transformRuntime from './utils/transformRuntime';
import type {
  BabelPresetSweetOptions as Options,
  BabelPresetSweet,
  EnvOptions,
  ReactOptions,
  TypescriptOptions
} from './types';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

function babelPresetSweet(api: any, options: Options = {}, dirname: string): BabelPresetSweet {
  const { env, typescript, react, polyfill }: Options = options;
  const { nodeEnv, ecmascript, targets: customTargets, debug, modules, useBuiltIns }: EnvOptions = env ?? {},
    { use: useTypescript, isReact = true }: TypescriptOptions = typescript ?? {},
    { use: useReact = true, runtime, development }: ReactOptions = react ?? {};
  const envModules: string | boolean = modules ?? false; // @babel/preset-env的模块类型

  const presets: Array<any> = [];
  const plugins: Array<any> = defaultPlugins.concat([
    transformRuntime({
      ecmascript,
      nodeEnv,
      polyfill
    })
  ]);

  // 添加@babel/preset-env
  presets.push(
    presetEnv({
      ecmascript,
      useBuiltIns,
      customTargets,
      nodeEnv,
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