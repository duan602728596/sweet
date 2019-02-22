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
export function formatTemplateData<T>(data: T): any {
  if (typeof data === 'object') {
    return JSON.stringify(data);
  }

  return data;
}

/* 替换模板内的占位符 */
export function replaceTemplate(template: string, data: object): string {
  let newTp: string = template;

  for (const key in data) {
    const reg: RegExp = new RegExp(`<%=\\s*${ key }\\s*%>`, 'g');

    newTp = newTp.replace(reg, formatTemplateData(data[key]));
  }

  newTp = newTp.replace(/<%=\s*[0-9a-zA-Z_$]+\s*%>/g, '');

  return newTp;
}

/* 清除模块缓存 */
export function cleanRequireCache(id: any): void {
  const modulePath: string = require.resolve(id);

  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(id), 1);
  }

  require.cache[modulePath] = null;
}

/* 格式化 */
export function pathAnalyze(file: string): string {
  const file2: Array<string> = file.split('/');

  for (let i: number = file2.length - 1; i >= 0; i--) {
    const item: string = file2[i];

    if (item === '') {
      file2.splice(i, 1);
    } else if (file2[i][0].length > 0) {
      file2[i] = `${ item[0].toLowerCase() }${ item.slice(1) }`;
    }
  }

  if (file2.length === 0) {
    return 'index';
  } else {
    return file2.join('.');
  }
}

/* 设置默认文件地址 */
export const defaultInterfacePath: Function = (sweetOptions: SweetOptions): string => {
  return path.join(sweetOptions.basicPath, 'service/interface');
};

export const defaultInterfaceJsFilename: Function = (sweetOptions: SweetOptions): string => {
  return path.join(defaultInterfacePath(sweetOptions), 'default.js');
};

export const defaultRoutersPath: Function = (sweetOptions: SweetOptions): string => {
  return path.join(sweetOptions.basicPath, 'service/routers.js');
};

/* @babel/register配置 */
interface RegisterConfig{
  presets: Array<any>;
  plugins: Array<string>;
  cache: boolean;
  configFile: boolean;
  babelrc: boolean;
  only: Array<RegExp>;
}

export const registerConfig: RegisterConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['node 9']
        },
        debug: false,
        modules: 'commonjs',
        useBuiltIns: 'usage'
      }
    ],
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties'
  ],
  cache: false,
  configFile: false,
  babelrc: false,
  only: [/[\\/]service[\\/]/]
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