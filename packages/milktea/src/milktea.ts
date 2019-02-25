import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import * as cosmiconfig from 'cosmiconfig';
import * as webpack from 'webpack';
import webpackConfig from './config';
import serverConfig from './server';
import webpackDll from './dll';
import { isObject } from './utils/utils';
import jsRegisterLoader from './utils/jsRegisterLoader';
import { SweetConfig, SweetOptions } from './utils/types';

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/* cosmiconfig */
const moduleName: string = 'sweet';
const explorer: { searchSync: Function } = cosmiconfig(moduleName, {
  searchPlaces: [
    `${ moduleName }.config.js`,
    `.${ moduleName }rc.js`
  ],
  loaders: {
    '.js': jsRegisterLoader
  },
  stopDir: sweetOptions.basicPath
});

/* 获取配置文件 */
const errorMsg: string = 'Please configure the .sweetrc.js or sweet.config.js file first.';

function getSweetConfigFile(configFile?: string): SweetConfig {
  if (typeof configFile === 'string') {
    // 加载其他的配置文件
    let sweetConfigFile: string;

    if (path.isAbsolute(configFile)) {
      sweetConfigFile = configFile;
    } else {
      sweetConfigFile = path.join(sweetOptions.basicPath, configFile);
    }

    if (fs.existsSync(sweetConfigFile)) {
      // 加载es6+环境
      return jsRegisterLoader(sweetConfigFile);
    } else {
      throw new Error(errorMsg);
    }
  } else {
    // 加载默认的配置文件
    const searchResult: { config: SweetConfig; filepath: string } | null = explorer.searchSync();

    if (searchResult === null) {
      throw new Error(errorMsg);
    } else {
      return searchResult.config;
    }
  }
}

/* webpack的回调函数 */
export function callback(err: Error, stats: webpack.Stats): void {
  console.log(stats.toString({
    colors: true
  }));
}

/**
 * webpack配置
 * @param { object | string | null } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 */
export function config(sweetConfig: SweetConfig | string | null, mode: string): object {
  let config: SweetConfig | null;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetConfig);
  } else if (isObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile();
  }

  if (config && mode) {
    config.mode = mode;
  }

  return webpackConfig(config, sweetOptions);
}

/**
 * 服务器端渲染的webpack配置
 * @param { object | string | null } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 */
export function serverRenderConfig(sweetConfig: SweetConfig | string | null, mode: string): object {
  let config: SweetConfig | null;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetConfig);
  } else if (isObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile();
  }

  if (config && mode) {
    config.mode = mode;
  }

  return serverConfig(config, sweetOptions);
}

/**
 * webpack的dll文件配置
 * @param { object | string | null } sweetConfig: webpack配置，覆盖文件，优先级最高
 */
export function dll(sweetConfig: SweetConfig | string | null): object {
  let config: SweetConfig | null;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetConfig);
  } else if (isObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile();
  }

  return webpackDll(config, sweetOptions);
}