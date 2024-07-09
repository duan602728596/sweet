import type { PluginItem } from '@babel/core';

// @babel/preset-env的配置
export interface EnvOptions {
  nodeEnv?: boolean;              // 是否为node环境
  ecmascript?: boolean;           // 编译到esnext
  targets?: object;               // 自定义babel的编译版本
  debug?: boolean;                // 开启debug信息
  modules?: boolean | string;     // modules
  useBuiltIns?: boolean | string; // useBuiltIns
}

// @babel/preset-typescript的配置
export interface TypescriptOptions {
  use?: boolean;     // 是否添加@babel/preset-typescript
  isReact?: boolean; // 是否开启react jsx的转换
}

// @babel/preset-react的配置
interface ReactCompilerConfig {
  sources?(filename: string): boolean;
  compilationMode?: 'annotation';
}

export interface ReactOptions {
  use?: boolean;         // 是否添加@babel/preset-react
  runtime?: string;      // 是否使用react/jsx-runtime
  development?: boolean; // 是否为开发环境
  reactCompiler?: boolean | ReactCompilerConfig;
}

// babel配置
export interface BabelPresetSweetOptions {
  env?: EnvOptions;
  typescript?: TypescriptOptions;
  react?: ReactOptions;
  polyfill?: boolean;
}

export interface BabelPresetSweet {
  presets: Array<PluginItem>;
  plugins: Array<PluginItem>;
}