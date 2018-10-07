import * as fs from 'fs';
import * as path from 'path';
import { SweetOptions } from './types';

/* 读取文件 */
export function readFile(file: string): Promise<any>{
  return new Promise((resolve: Function, reject: Function): void=>{
    fs.readFile(file, (err: Error, data: Buffer): void=>{
      if(err){
        reject(err);
      }else{
        resolve(data);
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/* 格式化数据 */
export function formatTemplateData(data: any): any{
  if(typeof data === 'object'){
    return JSON.stringify(data);
  }

  return data;
}

/* 替换模板内的占位符 */
export function replaceTemplate(template: string, data: any): string{
  let newTp: string = template;

  // @ts-ignore
  for(const key: string in data){
    const reg: RegExp = new RegExp(`{%\\s*${ key }\\s*%}`, 'g');
    newTp = newTp.replace(reg, formatTemplateData(data[key]));
  }

  newTp = newTp.replace(/{%\s*[0-9a-zA-Z_$]+\s*%}/g, '');

  return newTp;
}

/* 清除模块缓存 */
export function cleanRequireCache(module: string): void{
  const modulePath: string = require.resolve(module);

  // @ts-ignore
  if(module.parent){
    // @ts-ignore
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }

  require.cache[modulePath] = null;
}

/* 格式化 */
export function pathAnalyze(file: string): string{
  const file2: Array<string> = file.split('/');

  for(let i: number = file2.length - 1; i >= 0; i--){
    const item: string = file2[i];

    if(item === ''){
      file2.splice(i, 1);
    }else if(file2[i][0].length > 0){
      file2[i] = `${ item[0].toLowerCase() }${ item.slice(1) }`;
    }
  }

  if(file2.length === 0){
    return 'index';
  }else{
    return file2.join('.');
  }
}

/* 设置默认文件地址 */
export const defaultInterfacePath: Function = (sweetOptions: SweetOptions): string=>{
  return path.join(sweetOptions.basicPath, 'service/interface');
};

export const defaultInterfaceJsFilename: Function = (sweetOptions: SweetOptions): string=>{
  return path.join(defaultInterfacePath(sweetOptions), 'default.js');
};

export const defaultRoutersPath: Function = (sweetOptions: SweetOptions): string=>{
  return path.join(sweetOptions.basicPath, 'service/routers.js');
};

/* @babel/register配置 */
interface RegisterConfig{
  presets: Array<any>;
  plugins: Array<string>;
  cache: boolean;
  babelrc: boolean;
  only: Array<RegExp>;
}

export const registerConfig: RegisterConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['node 6']
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
  babelrc: false,
  only: [/[\\/]service[\\/]/]
};

/* 模块导入 */
export function requireModule(id: string): any{
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}