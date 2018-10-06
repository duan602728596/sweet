export interface SweetOptions{
  basicPath: string;
}

export interface Loaders{
  js?: object;
  sass?: object;
  css?: object;
  favicon?: object;
  fontFile?: object;
  html?: object;
  image?: object;
  svg?: object;
  vue?: object;
}

export interface Loader{
  test?: RegExp;
  use?: Array<any>;
  exclude?: RegExp;
  include?: RegExp;
  oneOf?: Array<any>;
}

export interface LoaderOption{
  loader?: string | any;
  options?: any;
}

export interface SweetConfig{
  mode?: string;
  dll?: Array<string>;
  entry?: any;
  output?: any;
  externals?: object;
  resolve?: object;
  loaders?: Loaders;
  rules?: Array<any>;
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

export interface WebpackConfig{
  mode?: string;
  entry?: any;
  output?: any;
  devtool?: string;
  externals?: object;
  resolve?: object;
  module?: {
    rules: Array<any>;
  };
  plugins?: Array<any>;
  optimization?: object;
  target?: string;
  node?: {
    __filename: boolean;
    __dirname: boolean;
  };
}