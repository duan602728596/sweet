import fs from 'fs';
import path from 'path';
import process from 'process';

/* 读取文件 */
export function readFile(file: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    fs.readFile(file, (err: Error, data: ArrayBuffer): void=>{
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
export function replaceTemplate(template: string, data: Object = {}): string{
  let newTp: string = template;

  for(const key: string in data){
    const reg: RegExp = new RegExp(`{%\\s*${ key }\\s*%}`);
    newTp = newTp.replace(reg, formatTemplateData(data[key]));
  }

  return newTp;
}

/* 清除模块缓存 */
export function cleanRequireCache(module: string): void{
  const modulePath: string = require.resolve(module);

  if(module.parent){
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }

  require.cache[modulePath] = null;
}

/* 格式化 */
export function pathAnalyze(file: string): string{
  const file2: [] = file.split('/');

  for(let i: number = file2.length - 1; i >= 0; i--){
    const item: Object = file2[i];

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
const cwd: string = process.cwd();
export const defaultInterfacePath: string = path.join(cwd, 'service/interface');
export const defaultRoutersPath: string = path.join(cwd, 'service/routers.js');

/* @babel/register配置 */
export const registerConfig: Object = {
  presets: [
    [
      '@babel/preset-env',
      {
        'targets': {
          'browsers': ['node 6']
        },
        'debug': false,
        'modules': 'commonjs',
        'useBuiltIns': 'usage'
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
  cache: true,
  babelrc: false,
  only: [/[\\/]service[\\/]/]
};