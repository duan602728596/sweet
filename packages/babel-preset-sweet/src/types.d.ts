import type { PluginItem } from '@babel/core';

// @babel/preset-env的配置
export interface EnvOptions {
  nodeEnv?: boolean;              // 是否为node环境
  ecmascript?: boolean;           // 编译到esnext
  targets?: object;               // 自定义babel的编译版本
  debug?: boolean;                // 开启debug信息
  modules?: boolean | string;     // modules
}

// @babel/preset-react的配置
export interface ReactOptions {
  use?: boolean;         // 是否添加@babel/preset-react
  runtime?: string;      // 是否使用react/jsx-runtime
  development?: boolean; // 是否为开发环境
}

// babel配置
export interface BabelPresetSweetOptions {
  env?: EnvOptions;
  react?: ReactOptions;
}

export interface BabelPresetSweet {
  presets: Array<PluginItem>;
  plugins: Array<PluginItem>;
  babelBuildTargets: object;
}