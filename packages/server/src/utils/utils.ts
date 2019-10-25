import * as path from 'path';
import * as Stream from 'stream';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import * as address from 'address';
import * as colors from 'colors/safe';
import { SweetOptions } from './types';

/* 格式化数据 */
export function formatTemplateData(data: Dictionary<any>): object {
  return _.transform(data, function(result: object, value: any, key: string): void {
    let item: any = value;

    if (typeof item === 'object') {
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
export function isReadStream(input: string | Stream): input is Stream {
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

    stream.on('error', function(err: Error): void {
      reject(err);
    });
  });
}

/* 格式化目录 */
export function formatPath(sweetOptions: SweetOptions, file: string): string {
  return path.isAbsolute(file) ? file : path.join(sweetOptions.basicPath, file);
}

export function runningAtLog(sweetOptions: SweetOptions, displayHttps: boolean): void {
  const ip: string = address.ip();
  const logs: string[] = [
    ' Running at:',
    ` - Local:   http://127.0.0.1:${ sweetOptions.httpPort }`,
    ` - Network: http://${ ip }:${ sweetOptions.httpPort }`
  ];

  if (displayHttps) {
    logs.splice(2, 0, `${ ' '.repeat(12) }https://127.0.0.1:${ sweetOptions.httpsPort }`);
    logs.push(`${ ' '.repeat(12) }https://${ ip }:${ sweetOptions.httpsPort }`);
  }

  console.log(`\n${ colors.blue(logs.join('\n')) }\n`);
}