import * as path from 'path';
import { isFileExists, moduleExists, requireModule } from '@sweet-milktea/utils';
import type { InlineConfig } from 'vite';
import type { SweetOptions, TS } from './types';

/**
 * 判断tsconfig.json文件是否存在
 * @param { SweetOptions } sweetOptions
 * @param { TS } ts
 */
export function isTsconfigJsonExists(sweetOptions: SweetOptions, ts?: TS): Promise<boolean> {
  const tsconfigJson: string = ts?.configFile ? (
    path.isAbsolute(ts.configFile) ? ts.configFile : path.join(sweetOptions.basicPath, ts.configFile)
  ) : path.join(sweetOptions.basicPath, 'tsconfig.json');

  return isFileExists(tsconfigJson);
}

/* 判断是否需要检查typescript */
export async function tsChecker(sweetOptions: SweetOptions, ts?: TS): Promise<boolean> {
  sweetOptions.tsChecker = !!(
    (moduleExists('typescript') as string | boolean)
    && ts?.tsChecker !== false
    && (await isTsconfigJsonExists(sweetOptions, ts)));

  return sweetOptions.tsChecker;
}

/* 添加插件 */
export async function addTsChecker(sweetOptions: SweetOptions, viteConfig: InlineConfig, ts?: TS): Promise<void> {
  if (await tsChecker(sweetOptions, ts)) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(
      (await requireModule('vite-plugin-checker'))({
        root: sweetOptions.basicPath,
        tsconfigPath: ts?.configFile ?? 'tsconfig.json'
      })
    );
  }
}