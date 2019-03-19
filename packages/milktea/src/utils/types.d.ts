import { ExternalsElement, RuleSetRule } from 'webpack';

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

export interface SweetConfig {
  mode?: 'development' | 'production' | 'none';
  dll?: Array<string>;
  entry?: any;
  output?: any;
  externals?: ExternalsElement | ExternalsElement[];
  resolve?: object;
  loaders?: Loaders;
  rules?: Array<RuleSetRule>;
  plugins?: Array<any>;
  js?: {
    ecmascript?: boolean;
    presets?: Array<any>;
    plugins?: Array<any>;
    resetPresets?: Array<any>;
    resetPlugins?: Array<any>;
    exclude?: RegExp;
    include?: RegExp;
  };
  sass?: {
    publicPath?: string;
    modules?: boolean;
    exclude?: RegExp;
    include?: RegExp;
  };
  css?: {
    publicPath?: string;
    modules?: boolean;
    exclude?: RegExp;
    include?: RegExp;
    modifyVars?: object;
  };
  html?: Array<{
    template: string;
    excludeChunks: Array<string>;
  }>;
  serverRender?: boolean;
  serverEntry?: any;
  serverOutput?: any;
  frame?: string;
}