import type { RuleSetRule, Entry, ResolveOptions, WebpackPluginInstance, Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import type { CosmiconfigResult } from 'cosmiconfig/dist/types';
import type { Options as HtmlWebpackPluginOptions } from 'html-webpack-plugin';

/* 当前的编译环境 */
export type Environment = 'dll' | 'client' | 'server';

/* SweetOptions参数 */
export interface SweetOptions {
  basicPath: string;
  environment: Environment;
}

/* sweet.config.js导出函数时，传递的参数 */
export interface Info {
  environment: Environment;
}

/* config的loaders配置 */
export interface Loaders {
  js?: RuleSetRule;
  ts?: RuleSetRule;
  sass?: RuleSetRule;
  css?: RuleSetRule;
  favicon?: RuleSetRule;
  fontFile?: RuleSetRule;
  html?: RuleSetRule;
  image?: RuleSetRule;
  svg?: RuleSetRule;
  vue?: RuleSetRule;
}

/* js配置 */
export interface JS {
  targets?: object;
  ecmascript?: boolean;
  typescript?: boolean;
  presets?: Array<any>;
  plugins?: Array<any>;
  resetPresets?: Array<any>;
  resetPlugins?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
}

/* typescript配置 */
export interface TS {
  configFile?: string;
  presets?: Array<any>;
  plugins?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
  forkTsCheckerWebpackPlugin?: boolean;
}

/* css配置 */
export interface CSS {
  publicPath?: string;
  modules?: boolean;
  exclude?: RegExp;
  include?: RegExp;
  localIdentName?: string;
}

/* less配置 */
export interface LESS extends CSS {
  modifyVars?: object;
  additionalData?: string | Function;
}

/* sass配置 */
export interface SASS extends CSS {
  additionalData?: string | Function;
}

export type Mode = Configuration.mode;
export type Frame = 'react' | 'vue' | 'test';  // 当前使用的组件
export type WebpackLog = 'progress' | 'stats'; // 当前使用的进度条

/* sweet.config.js的配置 */
export interface SweetConfig {
  mode?: Mode;
  webpackLog?: WebpackLog;
  dll?: [string, ...string[]];
  entry?: Entry;
  output?: any;
  externals?: { [key: string]: string };
  resolve?: ResolveOptions;
  devtool?: string;
  loaders?: Loaders;
  rules?: Array<RuleSetRule>;
  noParse?: string | Function | RegExp | [string | Function | RegExp, ...(string | Function | RegExp)[]];
  plugins?: WebpackPluginInstance[];
  js?: JS;
  ts?: TS;
  sass?: SASS;
  css?: LESS;
  html?: Array<HtmlWebpackPluginOptions>;
  frame?: Frame;
  chainWebpack?: (config: Config) => void;
  filesMap?: boolean | { [key: string]: string };
  hot?: boolean;
  // ssr
  serverRender?: boolean;
  serverEntry?: Entry;
  serverOutput?: any;
  serverExternals?: { [key: string]: string };
  serverDevtool?: string;
  serverChainWebpack?: (config: Config) => void;
}

/* 获取配置文件 */
export interface ExplorerSync {
  readonly search: (searchFrom?: string) => CosmiconfigResult;
  readonly load: (filepath: string) => CosmiconfigResult;
  readonly clearLoadCache: () => void;
  readonly clearSearchCache: () => void;
  readonly clearCaches: () => void;
}