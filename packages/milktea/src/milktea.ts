import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import webpackConfig from './config';
import serverConfig from './server';
import webpackDll from './dll';
import { requireModule, isObject, registerConfig } from './utils/utils';
import { SweetConfig, SweetOptions } from './utils/types';

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/* 获取配置文件 */
function getSweetConfig(): SweetConfig{
  const sweetConfigFile: string = path.join(sweetOptions.basicPath, '.sweetrc.js');

  if(fs.existsSync(sweetConfigFile)){
    // 加载es6+环境
    const register: Function = requireModule('@babel/register');

    register(registerConfig);

    return requireModule(sweetConfigFile);
  }else{
    throw new Error('Please configure the .sweetrc.js file first.');
  }
}

/* webpack的回调函数 */
export function callback(err: any, stats: { toString: Function }): void{
  console.log(stats.toString({
    colors: true
  }));
}

/* webpack配置 */
export function config(sweetConfig: SweetConfig, mode: string): object{
  let config: SweetConfig;

  if(isObject(sweetConfig)){
    config = sweetConfig;
  }else{
    config = getSweetConfig();
  }

  if(mode){
    config.mode = mode;
  }

  return webpackConfig(config, sweetOptions);
}

/* 服务器端渲染的webpack配置 */
export function serverRenderConfig(sweetConfig: SweetConfig, mode: string): object{
  let config: SweetConfig;

  if(isObject(sweetConfig)){
    config = sweetConfig;
  }else{
    config = getSweetConfig();
  }

  if(mode){
    config.mode = mode;
  }

  return serverConfig(config, sweetOptions);
}

/* webpack的dll文件配置 */
export function dll(sweetConfig: SweetConfig): object{
  let config: SweetConfig;

  if(isObject(sweetConfig)){
    config = sweetConfig;
  }else{
    config = getSweetConfig();
  }

  return webpackDll(config, sweetOptions);
}