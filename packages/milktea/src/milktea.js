import fs from 'fs';
import path from 'path';
import process from 'process';
import webpackConfig from './config';
import webpackDll from './dll';

function getSweetConfig(): Object{
  const cwd: string = process.cwd();
  const sweetConfig: string = path.join(cwd, '.sweet.config.js');

  if(fs.existsSync(sweetConfig)){
    return require(sweetConfig);
  }else{
    throw new Error('Please configure the .sweet.config.js file first.');
  }
}

// 回调函数
export function callback(err: any, stats: Object): void{
  console.log(stats.toString({
    colors: true
  }));
}

// webpack配置
export function config(): Object{
  const sweetConfig: Object = getSweetConfig();
  return webpackConfig(sweetConfig);
}

// dll配置
export function dll(): void{
  const sweetConfig: Object = getSweetConfig();
  return webpackDll(sweetConfig);
}