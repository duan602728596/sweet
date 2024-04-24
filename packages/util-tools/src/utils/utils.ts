import { glob } from 'glob';

/**
 * 格式化路径
 * @param { string } p - 原始路径
 */
export function formatPath(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * 获取所有文件
 */
export function getFiles(cwd: string, file: string): Promise<string[]> {
  return glob(file, { cwd });
}