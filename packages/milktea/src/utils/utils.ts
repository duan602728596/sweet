import * as path from 'path';
import * as fs from 'fs';
import type { SweetOptions, TS } from './types';

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 判断模块是否存在 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

/**
 * 判断tsconfig.json文件是否存在
 * @param { SweetOptions } sweetOptions
 * @param { TS } ts
 */
export function isTsconfigJsonExists(sweetOptions: SweetOptions, ts?: TS): boolean {
  const tsconfigJson: string = ts?.configFile ? (
    path.isAbsolute(ts.configFile) ? ts.configFile : path.join(sweetOptions.basicPath, ts.configFile)
  ) : path.join(sweetOptions.basicPath, 'tsconfig.json');

  return fs.existsSync(tsconfigJson);
}

/* lodash.mergeWith合并函数 */
export function customizer(objValue: any, srcValue: any): Array<any> | undefined {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/* extensions扩展名 */
export const extensions: Array<string> = ['.mjs', '.ts', '.tsx', '.js', '.jsx', 'cjs', '.json', '.vue', '.wasm'];