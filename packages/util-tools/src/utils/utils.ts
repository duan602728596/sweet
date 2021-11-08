import * as util from 'util';
import glob from 'glob';
import importESM from '@sweet-milktea/utils/importESM';
import type ImageMin from 'imagemin';

const globPromise: (arg1: string, arg2?: glob.IOptions) => Promise<string[]> = util.promisify(glob);

/**
 * 格式化路径
 * @param { string } p: 原始路径
 */
export function formatPath(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * 获取所有文件
 */
export function getFiles(cwd: string, file: string): Promise<string[]> {
  return globPromise(file, { cwd });
}

export async function getImageMin(): Promise<typeof ImageMin> {
  const imageMinModule: { default: typeof ImageMin } = await importESM('imagemin');

  return imageMinModule.default;
}