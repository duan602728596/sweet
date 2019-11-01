import {
  ExternalsElement,
  RuleSetRule,
  Resolve,
  Options,
  Plugin,
  Entry,
  EntryFunc,
  Output,
  RuleSetCondition
} from 'webpack';
import * as Config from 'webpack-chain';

export interface SweetOptions {
  basicPath: string;
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
}

export interface SASS extends CSS {
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
  entry?: string | Array<string> | Entry | EntryFunc;
  output?: Output;
  externals?: ExternalsElement | ExternalsElement[];
  resolve?: Resolve;
  devtool?: Options.Devtool;
  loaders?: Loaders;
  rules?: Array<RuleSetRule>;
  noParse?: RegExp | Array<RegExp> | ((content: string) => boolean);
  plugins?: Array<Plugin>;
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
  serverEntry?: string | Array<string> | Entry | EntryFunc;
  serverOutput?: Output;
  serverExternals?: ExternalsElement | ExternalsElement[];
  serverDevtool?: Options.Devtool;
  serverChainWebpack?: (config: Config) => void;
}