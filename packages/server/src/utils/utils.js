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

/* 替换模板内的占位符 */
export function replaceTemplate(template: string, data: Object = {}): string{
  let newTp: string = template;
  for(const key: string in data){
    const reg: RegExp = new RegExp(`{%\\s*${ key }\\s*%}`);
    newTp = newTp.replace(reg, data[key]);
  }
  return newTp;
}

// 清除模块缓存
export function cleanRequireCache(module: string): void{
  const modulePath: string = require.resolve(module);
  if(module.parent){
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }
  require.cache[modulePath] = null;
}

const cwd: string = process.cwd();
export const defaultInterfacePath: string = path.join(cwd, 'service/interface');
export const defaultRoutersPath: string = path.join(cwd, 'service/routers');
export const defaultServerRenderFile: string = path.join(cwd, 'build/server');