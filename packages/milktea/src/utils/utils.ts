import * as path from 'node:path';
import { isFileExists } from '@sweet-milktea/utils';
import type { SweetConfig, SweetOptions, TSOptions } from './types.js';

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

/* lodash.mergeWith合并函数 */
export function customizer(objValue: unknown, srcValue: unknown): Array<unknown> | undefined {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/* extensions扩展名 */
export const extensions: Array<string> = [
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.jsx',
  '.vue',
  '.json',
  '.wasm'
];