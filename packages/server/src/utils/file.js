import fs from 'fs';

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