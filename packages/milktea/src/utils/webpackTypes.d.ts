/* webpack未导出的类型 */
import type {
  Compiler,
  WebpackPluginInstance,
  ChunkGraph,
  Chunk,
  Module
} from 'webpack';

// Externals
export type ExternalItem =
  | string
  | RegExp
  | { [index: string]: string | boolean | string[] | { [index: string]: any } }
  | ((
  data: { context: string; request: string },
  callback: (err: Error, result: string) => void
) => void);

export type Externals =
  | string
  | RegExp
  | ExternalItem[]
  | { [index: string]: string | boolean | string[] | { [index: string]: any } }
  | ((
  data: { context: string; request: string },
  callback: (err: Error, result: string) => void
) => void);

// ResolveOptions
type LibraryExport = string | string[];

declare interface ResolvePluginInstance {
  [index: string]: any;
  apply: (resolver?: any) => void;
}

export declare interface ResolveOptions {
  alias?:
    | {
    alias: string | false | string[];
    name: string;
    onlyModule?: boolean;
  }[]
    | { [index: string]: string | false | string[] };
  aliasFields?: LibraryExport[];
  cache?: boolean;
  cachePredicate?: Function;
  cacheWithContext?: boolean;
  descriptionFiles?: string[];
  enforceExtension?: boolean;
  extensions?: string[];
  fileSystem?: { [index: string]: any };
  mainFields?: LibraryExport[];
  mainFiles?: string[];
  modules?: string[];
  plugins?: ResolvePluginInstance[];
  resolver?: { [index: string]: any };
  symlinks?: boolean;
  unsafeCache?: boolean | { [index: string]: any };
  useSyncFileSystemCalls?: boolean;
}

// DevTool
export type DevTool = string | false;

// plugins
export type Plugins = (
  | ((this: Compiler, compiler: Compiler) => void)
  | WebpackPluginInstance
  )[]

// Output
declare interface ChunkPathData {
  id: string | number;
  name?: string;
  hash: string;
  hashWithLength?: (arg0: number) => string;
  contentHash?: Record<string, string>;
  contentHashWithLength?: Record<string, (length: number) => string>;
}

declare interface ModulePathData {
  id: string | number;
  hash: string;
  hashWithLength?: (arg0: number) => string;
}

declare interface PathData {
  chunkGraph?: ChunkGraph;
  hash?: string;
  hashWithLength?: (arg0: number) => string;
  chunk?: Chunk | ChunkPathData;
  module?: Module | ModulePathData;
  filename?: string;
  basename?: string;
  query?: string;
  contentHashType?: string;
  contentHash?: string;
  contentHashWithLength?: (arg0: number) => string;
  noChunkHash?: boolean;
  url?: string;
}

declare interface AssetInfo {
  immutable?: boolean;
  size?: number;
  development?: boolean;
  hotModuleReplacement?: boolean;
}

type AssetModuleFilename =
  | string
  | ((pathData: PathData, assetInfo: AssetInfo) => string);

declare interface LibraryCustomUmdCommentObject {
  amd?: string;
  commonjs?: string;
  commonjs2?: string;
  root?: string;
}

type AuxiliaryComment = string | LibraryCustomUmdCommentObject;
type CrossOriginLoading = false | 'anonymous' | 'use-credentials';
type DevtoolFallbackModuleFilenameTemplate = string | Function;
type LibraryType =
  | 'var'
  | 'module'
  | 'assign'
  | 'this'
  | 'window'
  | 'self'
  | 'global'
  | 'commonjs'
  | 'commonjs2'
  | 'commonjs-module'
  | 'amd'
  | 'amd-require'
  | 'umd'
  | 'umd2'
  | 'jsonp'
  | 'system';
type Filename = string | ((pathData: PathData, assetInfo: AssetInfo) => string);

declare class Hash {
  constructor();
  update(data: string | Buffer, inputEncoding?: string): Hash;
  digest(encoding?: string): string | Buffer;
}

type HashFunction = string | typeof Hash;
type JsonpScriptType = false | 'module' | 'text/javascript';

declare interface LibraryCustomUmdObject {
  amd?: string;
  commonjs?: string;
  root?: LibraryExport;
}

type LibraryName = string | string[] | LibraryCustomUmdObject;

declare interface LibraryOptions {
  auxiliaryComment?: AuxiliaryComment;
  export?: LibraryExport;
  name?: LibraryName;
  type: LibraryType;
  umdNamedDefine?: boolean;
}

type Library = string | string[] | LibraryOptions | LibraryCustomUmdObject;

type PublicPath =
  | string
  | ((pathData: PathData, assetInfo: AssetInfo) => string);

export declare interface Output {
  assetModuleFilename?: AssetModuleFilename;
  auxiliaryComment?: AuxiliaryComment;
  chunkCallbackName?: string;
  chunkFilename?: string;
  chunkLoadTimeout?: number;
  compareBeforeEmit?: boolean;
  crossOriginLoading?: CrossOriginLoading;
  devtoolFallbackModuleFilenameTemplate?: DevtoolFallbackModuleFilenameTemplate;
  devtoolModuleFilenameTemplate?: DevtoolFallbackModuleFilenameTemplate;
  devtoolNamespace?: string;
  ecmaVersion?: number;
  enabledLibraryTypes?: LibraryType[];
  filename?: Filename;
  globalObject?: string;
  hashDigest?: string;
  hashFunction?: HashFunction;
  hotUpdateChunkFilename?: string;
  hotUpdateFunction?: string;
  hotUpdateMainFilename?: string;
  iife?: boolean;
  importFunctionName?: string;
  jsonpFunction?: string;
  jsonpScriptType?: JsonpScriptType;
  library?: Library;
  libraryExport?: LibraryExport;
  libraryTarget?: LibraryType;
  module?: boolean;
  path?: string;
  pathinfo?: boolean;
  publicPath?: PublicPath;
  sourceMapFilename?: string;
  sourcePrefix?: string;
  strictModuleExceptionHandling?: boolean;
  umdNamedDefine?: boolean;
  uniqueName?: string;
  webassemblyModuleFilename?: string;
}

// RuleSetCondition
type RuleSetCondition =
  | string
  | RegExp
  | {
  and?: RuleSetCondition[];
  not?: RuleSetCondition[];
  or?: RuleSetCondition[];
}
  | ((value: string) => boolean)
  | RuleSetCondition[];

// RuleSetUse
type RuleSetLoaderOptions = string | { [index: string]: any };
type __TypeWebpackOptions = (data: {}) =>
  | string
  | {
  ident?: string;
  loader?: string;
  options?: RuleSetLoaderOptions;
}
  | __TypeWebpackOptions
  | RuleSetUseItem[];
type RuleSetUseItem =
  | string
  | {
  ident?: string;
  loader?: string;
  options?: RuleSetLoaderOptions;
}
  | __TypeWebpackOptions;

export type RuleSetUse =
  | string
  | RuleSetUseItem[]
  | ((data: {
  resource: string;
  realResource: string;
  resourceQuery: string;
  issuer: string;
  compiler: string;
}) => RuleSetUseItem[])
  | {
  ident?: string;
  loader?: string;
  options?: RuleSetLoaderOptions;
}
  | ((data: {}) =>
  | string
  | {
  ident?: string;
  loader?: string;
  options?: RuleSetLoaderOptions;
}
  | __TypeWebpackOptions
  | RuleSetUseItem[]);