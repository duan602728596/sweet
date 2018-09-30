import fs from 'fs';
import path from 'path';
import process from 'process';
import webpackConfig from './config';
import serverConfig from './server';
import webpackDll from './dll';
import { isObject, registerConfig } from './utils';

/* 基础配置 */
const sweetOptions: {
  basicPath: string
} = {
  basicPath: process.cwd() // 主目录
};

/* 获取配置文件 */
function getSweetConfig(): Object{
  const sweetConfigFile: string = path.join(sweetOptions.basicPath, '.sweetrc.js');

  if(fs.existsSync(sweetConfigFile)){
    // 加载es6+环境
    const register: Function = require('@babel/register');

    register(registerConfig);

    const config: Object = require(sweetConfigFile);

    return 'default' in config ? config.default : config;
  }else{
    throw new Error('Please configure the .sweetrc.js file first.');
  }
}

/* webpack的回调函数 */
export function callback(err: any, stats: Object): void{
  console.log(stats.toString({
    colors: true
  }));
}

/* webpack配置 */
export function config(sweetConfig: ?Object, mode: string): Object{
  const config: Object = do{
    if(isObject(sweetConfig)){
      sweetConfig;
    }else{
      getSweetConfig();
    }
  };

  if(mode){
    config.mode = mode;
  }

  return webpackConfig(config, sweetOptions);
}

/* 服务器端渲染的webpack配置 */
export function serverRenderConfig(sweetConfig: ?Object, mode: string): Object{
  const config: Object = do{
    if(isObject(sweetConfig)){
      sweetConfig;
    }else{
      getSweetConfig();
    }
  };

  if(mode){
    config.mode = mode;
  }

  return serverConfig(config, sweetOptions);
}

/* webpack的dll文件配置 */
export function dll(sweetConfig: ?Object): void{
  const config: Object = do{
    if(isObject(sweetConfig)){
      sweetConfig;
    }else{
      getSweetConfig();
    }
  };

  return webpackDll(config, sweetOptions);
}