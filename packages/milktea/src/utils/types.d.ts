import type { RuleSetRule, Entry, ResolveOptions } from 'webpack';
import * as Config from 'webpack-chain';
import type { CosmiconfigResult } from 'cosmiconfig/dist/types';
import type { Externals, DevTool, Plugins, Output, RuleSetCondition } from './webpackTypes';

export interface SweetOptions {
  basicPath: string;
}

export type Environment = 'dll' | 'client' | 'server';

export interface Info {
  environment: Environment;
}

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

export interface JS {
  targets?: object;
  ecmascript?: boolean;
  typescript?: boolean;
  jsx?: boolean;
  presets?: Array<any>;
  plugins?: Array<any>;
  resetPresets?: Array<any>;
  resetPlugins?: Array<any>;
  exclude?: RuleSetCondition;
  include?: RuleSetCondition;
}

export interface TS {
  presets?: Array<any>;
  plugins?: Array<any>;
  exclude?: RuleSetCondition;
  include?: RuleSetCondition;
}

export interface CSS {
  publicPath?: string;
  modules?: boolean;
  exclude?: RuleSetCondition;
  include?: RuleSetCondition;
  localIdentName?: string;
  getLocalIdent?: Function;
}

export interface LESS extends CSS {
  modifyVars?: object;
  prependData?: string | Function;
  appendData?: string | Function;
}

export interface SASS extends CSS {
  additionalData?: string | Function;
  prependData?: string | Function;
  data?: string | Function;
}

export type Mode = 'development' | 'production' | 'none';
export type Frame = 'react' | 'vue' | 'test';
export type WebpackLog = 'progress' | 'stats';
export type HtmlItem = {
  [key: string]: any;
  template: string;
  excludeChunks: Array<string>;
};

export interface SweetConfig {
  mode?: Mode;
  webpackLog?: WebpackLog;
  dll?: Array<string>;
  entry?: Entry;
  output?: Output;
  externals?: Externals;
  resolve?: ResolveOptions;
  devtool?: DevTool;
  loaders?: Loaders;
  rules?: Array<RuleSetRule>;
  noParse?: RegExp | Array<RegExp> | ((content: string) => boolean);
  plugins?: Plugins;
  js?: JS;
  ts?: TS;
  sass?: SASS;
  css?: LESS;
  html?: Array<HtmlItem>;
  frame?: Frame;
  chainWebpack?: (config: Config) => void;
  filesMap?: boolean | { [key: string]: string };
  // ssr
  serverRender?: boolean;
  serverEntry?: Entry;
  serverOutput?: Output;
  serverExternals?: Externals;
  serverDevtool?: DevTool;
  serverChainWebpack?: (config: Config) => void;
}

export interface ExplorerSync {
  readonly search: (searchFrom?: string) => CosmiconfigResult;
  readonly load: (filepath: string) => CosmiconfigResult;
  readonly clearLoadCache: () => void;
  readonly clearSearchCache: () => void;
  readonly clearCaches: () => void;
}