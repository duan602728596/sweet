import fs from 'fs';
import path from 'path';
import process from 'process';
import webpackConfig from './config';
import serverConfig from './server';
import webpackDll from './dll';
import { isObject } from './utils';

function getSweetConfig(): Object{
  const cwd: string = process.cwd();
  const sweetConfig: string = path.join(cwd, 'sweet.config.js');

  if(fs.existsSync(sweetConfig)){
    const config: Object = require(sweetConfig);

    return config;
  }else{
    throw new Error('Please configure the sweet.config.js file first.');
  }
}

// 回调函数
export function callback(err: any, stats: Object): void{
  console.log(stats.toString({
    colors: true
  }));
}

// webpack配置
export function config(sweetConfig: ?Object, mode: string): Object{
  const sweetConfig2: Object = do{
    if(isObject(sweetConfig)){
      sweetConfig;
    }else{
      getSweetConfig();
    }
  };

  if(mode){
    sweetConfig2.mode = mode;
  }

  return webpackConfig(sweetConfig2);
}

// 服务器端渲染
export function serverRenderConfig(sweetConfig: ?Object, mode: string): Object{
  const sweetConfig2: Object = do{
    if(isObject(sweetConfig)){
      sweetConfig;
    }else{
      getSweetConfig();
    }
  };

  if(mode){
    sweetConfig2.mode = mode;
  }

  return serverConfig(sweetConfig2);
}

// dll配置
export function dll(sweetConfig: ?Object): void{
  const sweetConfig2: Object = do{
    if(isObject(sweetConfig)){
      sweetConfig;
    }else{
      getSweetConfig();
    }
  };

  return webpackDll(sweetConfig2);
}