import fs from 'fs';
import path from 'path';
import process from 'process';
import webpackConfig from './config';
import webpackDll from './dll';
import { isObject } from './utils';

function getSweetConfig(mode: string = 'development'): Object{
  const cwd: string = process.cwd();
  const sweetConfig: string = path.join(cwd, 'sweet.config.js');

  if(fs.existsSync(sweetConfig)){
    const config: Object = require(sweetConfig);

    if(!('mode' in config)) config.mode = mode;

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
export function config(modeOrSweetConfig: string | Object): Object{
  const sweetConfig: Object = do{
    if(isObject(modeOrSweetConfig)){
      modeOrSweetConfig;
    }else if(typeof modeOrSweetConfig === 'string'){
      getSweetConfig(modeOrSweetConfig);
    }else{
      throw new Error('Please configure the sweet.config.js file first.');
    }
  };

  return webpackConfig(sweetConfig);
}

// 服务器端渲染
export function serverRenderConfig(modeOrSweetConfig: string | Object): Object{
  const sweetConfig: Object = do{
    if(isObject(modeOrSweetConfig)){
      modeOrSweetConfig;
    }else if(typeof modeOrSweetConfig === 'string'){
      getSweetConfig(modeOrSweetConfig);
    }else{
      throw new Error('Please configure the sweet.config.js file first.');
    }
  };

  return webpackConfig(sweetConfig);
}

// dll配置
export function dll(modeOrSweetConfig: string | Object): void{
  const sweetConfig: Object = do{
    if(isObject(modeOrSweetConfig)){
      modeOrSweetConfig;
    }else if(typeof modeOrSweetConfig === 'string'){
      getSweetConfig(modeOrSweetConfig);
    }else{
      throw new Error('Please configure the sweet.config.js file first.');
    }
  };

  return webpackDll(sweetConfig);
}