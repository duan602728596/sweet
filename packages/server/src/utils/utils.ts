import * as util from 'util';
import * as path from 'path';
import * as Stream from 'stream';
import * as net from 'net';
import type { Server as NetServer } from 'net';
import glob from 'glob';
import internalIp from 'internal-ip';
import chalk from 'chalk';
import type { ViteDevServer } from 'vite';
import { requireCommonjsModule, requireModule } from '@sweet-milktea/utils';
import type { SweetOptions } from './types';

export const globPromise: (arg1: string, arg2?: glob.IOptions) => Promise<string[]> = util.promisify(glob);

/* 格式化数据 */
export function formatTemplateData(data: { [key: string]: any }): object {
  return Object.entries(data).reduce(function(result: object, [key, value]: [string, any]): object {
    let item: any = value;

    if (typeof item === 'object') {
      item = JSON.stringify(item);
    }

    result[key] = item;

    return result;
  }, {});
}

const exts: Array<string> = ['ts', 'tsx', 'mjs', 'js', 'cjs', 'jsx'];

/* 设置默认api文件的地址 */
export function defaultApiPath(basicPath: string): Array<string> {
  return exts.map((o: string) => path.join(basicPath, `api/api.${ o }`));
}

/* 设置默认的proxy代理的地址 */
export function defaultProxyPath(basicPath: string): Array<string> {
  return exts.map((o: string) => path.join(basicPath, `proxy/proxy.${ o }`));
}

/* 设置默认的mock的地址 */
export function defaultMockPath(basicPath: string): Array<string> {
  return exts.map((o: string) => path.join(basicPath, `mock/mock.${ o }`));
}

/* vite模块导入 */
export function requireViteModule(sweetOptions: SweetOptions): (id: string) => Promise<any> {
  const ssrLoadModule: Function = (sweetOptions.compiler as ViteDevServer).ssrLoadModule;

  return async function(id: string): Promise<any> {
    const modules: any = await ssrLoadModule(id);

    return 'default' in modules ? modules.default : modules;
  };
}

/* 判断是否为readStream */
export function isReadStream(input: string | Stream): input is Stream {
  return typeof input === 'object';
}

/* 读取stream流 */
type ReadStream = (stream: Stream) => Promise<Buffer>;
export const readStream: ReadStream = util.promisify(function(stream: Stream, callback: Function): void {
  const chunks: Array<Buffer> = [];

  stream.on('data', function(chunk: Buffer): void {
    chunks.push(chunk);
  });

  stream.on('end', function(): void {
    callback(null, Buffer.concat(chunks));
  });

  stream.on('error', function(err: Error): void {
    callback(err);
  });
});

/* 格式化目录 */
export function formatPath(sweetOptions: SweetOptions, file: string): string {
  return path.isAbsolute(file) ? file : path.join(sweetOptions.basicPath, file);
}

/* 启动日志 */
export async function runningAtLog(sweetOptions: SweetOptions, displayHttps: boolean): Promise<void> {
  const ip: string = await internalIp.v4() ?? '127.0.0.1';
  const logs: string[] = [
    ' Running at:',
    ` - Local:   http://127.0.0.1:${ sweetOptions.httpPort }`,
    ` - Network: http://${ ip }:${ sweetOptions.httpPort }`
  ];

  if (displayHttps) {
    logs.splice(2, 0, `${ ' '.repeat(12) }https://127.0.0.1:${ sweetOptions.httpsPort }`);
    logs.push(`${ ' '.repeat(12) }https://${ ip }:${ sweetOptions.httpsPort }`);
  }

  console.log(`\n${ chalk.blue(logs.join('\n')) }\n`);
}

/**
 * 检查端口占用情况
 * @param { number } port: 检查的端口
 */
export function portIsOccupied(port: number): Promise<boolean> {
  return new Promise(function(resolve: Function, reject: Function): void {
    const server: NetServer = net.createServer().listen(port);

    server.on('listening', (): void => {
      server.close();
      resolve(true);
    });

    server.on('error', (err: Error): void => {
      server.close();
      resolve(false);
    });
  });
}

/**
 * 判断端口是否被占用，并返回新的端口
 * @param { number } port: 检查的端口
 * @param { Array<number> } ignorePort: 忽略的端口
 */
export async function detectPort(port: number, ignorePort: Array<number> = []): Promise<number> {
  let maxPort: number = port + 10; // 最大端口
  let newNumber: number = port,    // 使用的端口
    pt: number = port;

  if (maxPort > 65535) {
    maxPort = 65535;
  }

  while (pt <= maxPort) {
    const portCanUse: boolean = await portIsOccupied(pt);

    if (portCanUse && !ignorePort.includes(pt)) {
      newNumber = pt;
      break;
    } else {
      pt++;
    }
  }

  return newNumber;
}

/**
 * TODO: @babel/register会将es6模块编译出exports.default，
 *       加载时会出现module.default.default的情况
 */
export function __fixModuleImportDefaultDefault<T = any>(data: T | { default: T }): T {
  return 'default' in data ? data['default'] : data;
}

/**
 * 加载模块，当commonjs加载失败时，使用import()加载
 * @param { string } findFile
 */
export async function __require<T>(findFile: string): Promise<T> {
  let modules: T;

  try {
    modules = await requireCommonjsModule(findFile);
  } catch {
    modules = await requireModule(findFile);
  }

  return modules;
}