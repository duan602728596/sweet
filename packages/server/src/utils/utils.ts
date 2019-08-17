import * as fs from 'fs';
import * as path from 'path';
import * as Stream from 'stream';
import * as _ from 'lodash';

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
  return _.transform(data, function(result: object, value: any, key: string): void {
    let item: any = value;

    if (_.isObject(item)) {
      item = JSON.stringify(item);
    }

    result[key] = item;
  }, {});
}

/* 格式化路径 */
export function folderPathAnalyze(file: string): string {
  const fileArr: Array<string> = _.without(file.split('/'), '');

  if (fileArr.length === 0) {
    return 'index';
  } else {
    return fileArr.join('/').toLowerCase();
  }
}

export function filePathAnalyze(file: string): string {
  const fileArr: Array<string> = _.without(file.split('/'), '');

  if (fileArr.length === 0) {
    return 'index';
  } else {
    return fileArr.join('.').toLowerCase();
  }
}

/* 设置默认api文件的地址 */
export function defaultApiPath(basicPath: string): string {
  return path.join(basicPath, 'api/api.js');
}

/* 设置默认的proxy代理的地址 */
export function defaultProxyPath(basicPath: string): { js: string; json: string } {
  return {
    js: path.join(basicPath, 'proxy/proxy.js'),
    json: path.join(basicPath, 'proxy/proxy.json')
  };
}

/* 清除模块缓存（只用于开发环境） */
export function cleanRequireCache(id: any): void {
  const modulePath: string = require.resolve(id);

  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(id), 1);
  }

  delete require.cache[modulePath];
}

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 模块导入并且清除缓存 */
export function deleteCacheAndRequireModule(id: string): any {
  cleanRequireCache(id);

  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 判断是否为readStream */
export function isReadStream<Input>(input: Input): boolean {
  return _.isObject(input) && input instanceof Stream;
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

    stream.on('error', function(err: Error): void {
      reject(err);
    });
  });
}