import fs from 'fs';
import path from 'path';
import process from 'process';
import webpackConfig from './config';
import serverConfig from './server';
import webpackDll from './dll';
import { isObject } from './utils';

/* 获取配置文件 */
function getSweetConfig(): Object{
  const cwd: string = process.cwd();
  const sweetConfig: string = path.join(cwd, '.sweetrc.js');

  if(fs.existsSync(sweetConfig)){
    const config: Object = require(sweetConfig);

    return config;
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

  return webpackConfig(config);
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

  return serverConfig(config);
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

  return webpackDll(config);
}