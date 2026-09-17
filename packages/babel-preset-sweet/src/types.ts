import type { PluginItem, PresetItem } from '@babel/core';
import type { Options as BabelPresetEnvOptions } from '@babel/preset-env';
import type { Options as BabelPresetReactOptions } from '@babel/preset-react';

// @babel/preset-env的配置
export interface IEnvOptions extends Pick<BabelPresetEnvOptions, 'targets' | 'debug' | 'modules'> {
  nodeEnv?: boolean;    // 是否为node环境
  ecmascript?: boolean; // 编译到esnext
}

// @babel/preset-react的配置
export interface IReactOptions extends Pick<BabelPresetReactOptions, 'runtime' | 'development'> {
  use?: boolean; // 是否添加@babel/preset-react
}

// @babel/preset-typescript的配置
export interface ITypescriptOptions {
  use?: boolean; // 是否添加@babel/preset-typescript
}

// babel配置
export interface IBabelPresetSweetOptions {
  env?: IEnvOptions;
  react?: IReactOptions;
  typescript?: ITypescriptOptions;
}

export interface IBabelPresetSweet {
  presets: Array<PresetItem>;
  plugins: Array<PluginItem>;
}