import type { ViteDevServer, InlineConfig } from 'vite';
import type { RollupOutput } from 'rollup';
import type { CosmiconfigResult } from 'cosmiconfig/dist/types';

/* 当前的编译环境 */
export type Environment = 'client' | 'server';

/* SweetOptions参数 */
export interface SweetOptions {
  basicPath: string;
  environment: Environment;
  tsChecker?: boolean; // typescript需要检查
}

/* sweet.config.js导出函数时，传递的参数 */
export interface Info {
  environment: Environment;
}

export type Mode = 'development' | 'production';
export type Frame = 'react' | 'vue' | 'test'; // 当前使用的组件

interface TS {
  configFile?: string;
  tsChecker?: boolean;
}

/* sweet.config.js的配置 */
export interface SweetConfig {
  mode?: Mode;
  frame?: Frame;
  vite?: InlineConfig;
  ts?: TS;
  // ssr
  serverEntry?: boolean;
  chainVite?: (config: InlineConfig) => Promise<void>;
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
}

export interface MilkVite {
  config(args: FuncArgs): Promise<ViteDevServer>;
  build(args: FuncArgs): Promise<RollupOutput | RollupOutput[]>;
  serverRenderBuild(args: FuncArgs): Promise<RollupOutput | RollupOutput[]>;
}