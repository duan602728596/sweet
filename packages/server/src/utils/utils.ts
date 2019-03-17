import * as fs from 'fs';
import * as path from 'path';
import * as Stream from 'stream';
import { SweetOptions } from './types';

/* 读取文件 */
export function readFile(file: string): Promise<Buffer> {
  return new Promise((resolve: Function, reject: Function): void => {
    fs.readFile(file, (err: Error, data: Buffer): void => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/* 格式化数据 */
export function formatTemplateData(data: object): object {
  const formatData: object = {};

  for (const key in data) {
    let item: any = data[key];

    if (typeof item === 'object') {
      item = JSON.stringify(item);
    }

    formatData[key] = item;
  }

  return formatData;
}

/* 清除模块缓存 */
export function cleanRequireCache(id: any): void {
  const modulePath: string = require.resolve(id);

  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(id), 1);
  }

  require.cache[modulePath] = null;
}

/* 格式化路径 */
export function folderPathAnalyze(file: string): string {
  const fileArr: Array<string> = file.split('/');

  for (let i: number = fileArr.length - 1; i >= 0; i--) {
    const item: string = fileArr[i];

    if (item === '') fileArr.splice(i, 1);
  }

  if (fileArr.length === 0) {
    return 'index';
  } else {
    return fileArr.join('/').toLowerCase();
  }
}

export function filePathAnalyze(file: string): string {
  const fileArr: Array<string> = file.split('/');

  for (let i: number = fileArr.length - 1; i >= 0; i--) {
    const item: string = fileArr[i];

    if (item === '') fileArr.splice(i, 1);
  }

  if (fileArr.length === 0) {
    return 'index';
  } else {
    return fileArr.join('.').toLowerCase();
  }
}

/* 设置默认文件地址 */
export const defaultApiPath: Function = (basicPath: string): string => {
  return path.join(basicPath, 'api/api.js');
};

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 判断是否为readStream */
export function isReadStream<Input>(input: Input): boolean {
  return typeof input === 'object' && input instanceof Stream;
}

/* 读取stream流 */
export function readStream(stream: Stream): Promise<Buffer> {
  const chunks: Array<Buffer> = [];

  return new Promise((resolve: Function, reject: Function): void => {
    stream.on('data', function(chunk: Buffer): void {
      chunks.push(chunk);
    });

    stream.on('end', function(): void {
      resolve(Buffer.concat(chunks));
    });
  });
}