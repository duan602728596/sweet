import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import * as webpack from 'webpack';
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
function getSweetConfigFile(configFile: string): SweetConfig{
  let sweetConfigFile: string;

  if(typeof configFile === 'string' && path.isAbsolute(configFile)){
    sweetConfigFile = configFile;
  }else{
    sweetConfigFile = path.join(sweetOptions.basicPath, configFile || '.sweetrc.js');
  }

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
export function callback(err: Error, stats: webpack.Stats): void{
  console.log(stats.toString({
    colors: true
  }));
}

/**
 * webpack配置
 * @param { object } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 * @param { string } configFile: 新的配置文件地址，覆盖默认的配置
 */
export function config(sweetConfig: SweetConfig, mode: string, configFile: string): object{
  let config: SweetConfig;

  if(isObject(sweetConfig)){
    config = sweetConfig;
  }else{
    config = getSweetConfigFile(configFile);
  }

  if(mode){
    config.mode = mode;
  }

  return webpackConfig(config, sweetOptions);
}

/**
 * 服务器端渲染的webpack配置
 * @param { object } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 * @param { string } configFile: 新的配置文件地址，覆盖默认的.sweetrc.js文件
 */
export function serverRenderConfig(sweetConfig: SweetConfig, mode: string, configFile: string): object{
  let config: SweetConfig;

  if(isObject(sweetConfig)){
    config = sweetConfig;
  }else{
    config = getSweetConfigFile(configFile);
  }

  if(mode){
    config.mode = mode;
  }

  return serverConfig(config, sweetOptions);
}

/**
 * webpack的dll文件配置
 * @param { object } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } configFile: 新的配置文件地址
 */
export function dll(sweetConfig: SweetConfig, configFile: string): object{
  let config: SweetConfig;

  if(isObject(sweetConfig)){
    config = sweetConfig;
  }else{
    config = getSweetConfigFile(configFile);
  }

  return webpackDll(config, sweetOptions);
}