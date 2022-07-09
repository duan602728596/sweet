import type { RuleSetRule, Entry, ResolveOptions, WebpackPluginInstance, Configuration, Stats } from 'webpack';
import type Config from 'webpack-chain';
import type { PluginItem } from '@babel/core';
import type { CosmiconfigResult } from 'cosmiconfig/dist/types';
import type { Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin';

/* 当前的编译环境 */
export type Environment = 'dll' | 'client' | 'server';

/* SweetOptions参数 */
export interface SweetOptions {
  basicPath: string;
  environment: Environment;
  forkTsCheckerWebpackPlugin?: boolean;
}

/* sweet.config.js导出函数时，传递的参数 */
export interface Info {
  environment: Environment;
}

/* config的loaders配置 */
interface ConfigRule {
  exclude?: RegExp | Array<RegExp>;
  include?: RegExp | Array<RegExp>;
}

interface ScriptRule extends ConfigRule {
  presets?: Array<PluginItem>;
  plugins?: Array<PluginItem>;
}

/* js配置 */
export interface JSOptions extends ScriptRule {
  targets?: object;
  ecmascript?: boolean;
  polyfill?: boolean;
  typescript?: boolean;
}

/* typescript配置 */
export interface TSOptions extends ScriptRule {
  configFile?: string;
  forkTsCheckerWebpackPlugin?: boolean;
}

/* css配置 */
export interface CSSOptions extends ConfigRule {
  modules?: boolean;
}

/* less配置 */
export interface LessOptions extends CSSOptions {
  modifyVars?: object;
  additionalData?: string | Function;
}

/* sass配置 */
export interface SassOptions extends CSSOptions {
  additionalData?: string | Function;
}

export type Mode = 'development' | 'production' | 'none';
export type Frame = 'react' | 'vue' | 'test';  // 当前使用的组件
export type WebpackLog = 'progress' | 'stats'; // 当前使用的进度条

/* sweet.config.js的配置 */
export interface SweetConfig {
  mode?: Mode;
  webpackLog?: WebpackLog;
  dll?: [string, ...string[]];
  context?: string;
  entry?: Entry;
  output?: any;
  externals?: { [key: string]: string };
  resolve?: ResolveOptions;
  devtool?: string;
  rules?: Array<RuleSetRule>;
  noParse?: string | Function | RegExp | (string | Function | RegExp)[];
  plugins?: WebpackPluginInstance[];
  /* @deprecated */
  js?: JSOptions;
  javascript?: JSOptions;
  /* @deprecated */
  ts?: TSOptions;
  typescript?: TSOptions;
  sass?: SassOptions;
  /* @deprecated */
  css?: LessOptions;
  less?: LessOptions;
  html?: Array<HtmlWebpackPluginOptions>;
  frame?: Frame;
  chainWebpack?: (config: Config) => Promise<void>;
  filesMap?: boolean | { [key: string]: string };
  hot?: boolean;
  socket?: 'sockjs' | 'ws';
  // ssr
  serverRender?: boolean;
  serverEntry?: Entry;
  serverOutput?: any;
  serverExternals?: { [key: string]: string };
  serverDevtool?: string;
  serverChainWebpack?: (config: Config) => Promise<void>;
}

/* 获取配置文件 */
export interface Explorer {
  readonly search: (searchFrom?: string) => Promise<CosmiconfigResult>;
  readonly load: (filepath: string) => Promise<CosmiconfigResult>;
  readonly clearLoadCache: () => void;
  readonly clearSearchCache: () => void;
  readonly clearCaches: () => void;
}

/* Milktea导出的文件 */
export type SweetConfigArgs = SweetConfig | string | null | undefined;

export interface FuncArgs {
  sweetConfig?: SweetConfigArgs;
  mode?: Mode;
  webpackLog?: WebpackLog;
  hot?: boolean;
  socket?: 'sockjs' | 'ws';
}

export interface Milktea {
  config(args: FuncArgs): Promise<Configuration>;
  serverRenderConfig(args: FuncArgs): Promise<Configuration>;
  dllConfig(args: FuncArgs): Promise<Configuration>;
  callback(err: Error, stats: Stats): void;
  callbackOnlyError(err: Error, stats: Stats): void;
}