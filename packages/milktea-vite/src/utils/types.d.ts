import type { InlineConfig } from 'vite';
import type { CosmiconfigResult } from 'cosmiconfig';

/* SweetOptions参数 */
export interface SweetOptions {
  basicPath: string;
}

/* sweet.config.js的配置 */
export interface SweetConfig {
  vite?: InlineConfig;
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
}