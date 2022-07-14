import * as path from 'node:path';
import { isFileExists, moduleExists, requireModule } from '@sweet-milktea/utils';
// @ts-ignore Node16
import type { InlineConfig } from 'vite';
import type { SweetOptions, TSOptions, Frame } from './types';

/**
 * 判断tsconfig.json文件是否存在
 * @param { SweetOptions } sweetOptions
 * @param { TSOptions } ts
 */
export function isTsconfigJsonExists(sweetOptions: SweetOptions, ts?: TSOptions): Promise<boolean> {
  const tsconfigJson: string = ts?.configFile ? (
    path.isAbsolute(ts.configFile) ? ts.configFile : path.join(sweetOptions.basicPath, ts.configFile)
  ) : path.join(sweetOptions.basicPath, 'tsconfig.json');

  return isFileExists(tsconfigJson);
}

/* 判断是否需要检查typescript */
export async function tsChecker(sweetOptions: SweetOptions, ts?: TSOptions): Promise<boolean> {
  sweetOptions.tsChecker = !!(
    (moduleExists('typescript') as string | boolean)
    && ts?.tsChecker !== false
    && (await isTsconfigJsonExists(sweetOptions, ts)));

  return sweetOptions.tsChecker;
}

/**
 * 添加插件
 * @param { SweetOptions } sweetOptions
 * @param { InlineConfig } viteConfig
 * @param { Frame } frame: frame为vue时，配置vueTsc
 * @param { TSOptions } ts
 */
export async function addTsChecker(sweetOptions: SweetOptions, viteConfig: InlineConfig, frame?: Frame, ts?: TSOptions): Promise<void> {
  if (await tsChecker(sweetOptions, ts)) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(
      (await requireModule('vite-plugin-checker', false)).default({
        typescript: {
          root: sweetOptions.basicPath,
          tsconfigPath: ts?.configFile ?? 'tsconfig.json'
        },
        vueTsc: frame === 'vue'
      })
    );
  }
}