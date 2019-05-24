import { ExternalsElement, RuleSetRule, Resolve, Options, Plugin, Entry, EntryFunc, Output, RuleSetCondition } from 'webpack';
import * as Config from 'webpack-chain';

export interface SweetOptions {
  basicPath: string;
}

export interface Loaders {
  js?: RuleSetRule;
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

export interface SweetConfig {
  mode?: 'development' | 'production' | 'none';
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
  sass?: {
    publicPath?: string;
    modules?: boolean;
    exclude?: RuleSetCondition;
    include?: RuleSetCondition;
  };
  css?: {
    publicPath?: string;
    modules?: boolean;
    exclude?: RuleSetCondition;
    include?: RuleSetCondition;
    modifyVars?: object;
  };
  html?: Array<{
    template: string;
    excludeChunks: Array<string>;
  }>;
  serverRender?: boolean;
  serverEntry?: string | Array<string> | Entry | EntryFunc;
  serverOutput?: Output;
  frame?: 'react' | 'vue' | 'test';
  chainWebpack?: (config: Config) => void;
}