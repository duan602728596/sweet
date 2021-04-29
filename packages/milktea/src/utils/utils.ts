import * as path from 'path';
import * as fs from 'fs';
import type { SweetOptions, TS } from './types';

/* 判断文件是否存在 */
export async function isExists(file: string): Promise<boolean> {
  try {
    await fs.promises.access(file);

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 判断tsconfig.json文件是否存在
 * @param { SweetOptions } sweetOptions
 * @param { TS } ts
 */
export function isTsconfigJsonExists(sweetOptions: SweetOptions, ts?: TS): Promise<boolean> {
  const tsconfigJson: string = ts?.configFile ? (
    path.isAbsolute(ts.configFile) ? ts.configFile : path.join(sweetOptions.basicPath, ts.configFile)
  ) : path.join(sweetOptions.basicPath, 'tsconfig.json');

  return isExists(tsconfigJson);
}

/* lodash.mergeWith合并函数 */
export function customizer(objValue: any, srcValue: any): Array<any> | undefined {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/* extensions扩展名 */
export const extensions: Array<string> = ['.mjs', '.ts', '.tsx', '.js', '.jsx', 'cjs', '.json', '.vue', '.wasm'];

export { requireModule, moduleExists, requirePlugin } from './moduleUtils';