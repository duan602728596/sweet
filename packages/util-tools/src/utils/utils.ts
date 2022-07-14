import * as util from 'util';
import glob from 'glob';
// @ts-ignore Node16
import type imageMin from 'imagemin';
// @ts-ignore Node16
import type Chalk from 'chalk';

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

/**
 * imagemin
 */
export async function getImageMin(): Promise<typeof imageMin> {
  const imageMinModule: { default: typeof imageMin } = await import('imagemin');

  return imageMinModule.default;
}

/**
 * chalk
 */
export async function getChalk(): Promise<typeof Chalk > {
  const chalkModule: { default: typeof Chalk } = await import('chalk');

  return chalkModule.default;
}