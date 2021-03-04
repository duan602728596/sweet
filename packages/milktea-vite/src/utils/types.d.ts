import type { InlineConfig } from 'vite';
import type { CosmiconfigResult } from 'cosmiconfig';

/* 当前的编译环境 */
export type Environment = 'client' | 'server';

/* SweetOptions参数 */
export interface SweetOptions {
  basicPath: string;
  environment: Environment;
}

/* sweet.config.js导出函数时，传递的参数 */
export interface Info {
  environment: Environment;
}

export type Mode = Configuration.mode;
export type Frame = 'react' | 'vue' | 'test'; // 当前使用的组件

/* sweet.config.js的配置 */
export interface SweetConfig {
  mode?: Mode;
  frame?: Frame;
  vite?: InlineConfig;
  // ssr
  serverEntry?: boolean;
  chainVite?: (config: InlineConfig) => void;
}

/* 获取配置文件 */
export interface ExplorerSync {
  readonly search: (searchFrom?: string) => CosmiconfigResult;
  readonly load: (filepath: string) => CosmiconfigResult;
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