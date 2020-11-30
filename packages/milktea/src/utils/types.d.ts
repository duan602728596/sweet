import type { RuleSetRule, Entry, ResolveOptions, WebpackPluginInstance } from 'webpack';
import * as Config from 'webpack-chain';
import type { CosmiconfigResult } from 'cosmiconfig/dist/types';

export type Environment = 'dll' | 'client' | 'server';

export interface SweetOptions {
  basicPath: string;
  environment: Environment;
}

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
  vue2?: boolean;
  presets?: Array<any>;
  plugins?: Array<any>;
  resetPresets?: Array<any>;
  resetPlugins?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
}

export interface TS {
  configFile?: string;
  presets?: Array<any>;
  plugins?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
}

export interface CSS {
  publicPath?: string;
  modules?: boolean;
  exclude?: RegExp;
  include?: RegExp;
  localIdentName?: string;
}

export interface LESS extends CSS {
  modifyVars?: object;
  additionalData?: string | Function;
}

export interface SASS extends CSS {
  additionalData?: string | Function;
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
  html?: Array<HtmlItem>;
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

export interface ExplorerSync {
  readonly search: (searchFrom?: string) => CosmiconfigResult;
  readonly load: (filepath: string) => CosmiconfigResult;
  readonly clearLoadCache: () => void;
  readonly clearSearchCache: () => void;
  readonly clearCaches: () => void;
}