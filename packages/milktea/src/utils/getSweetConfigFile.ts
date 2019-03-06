import * as fs from 'fs';
import * as path from 'path';
import * as cosmiconfig from 'cosmiconfig';
import { SweetConfig, SweetOptions } from './types';
import { requireModule } from './utils';

/* cosmiconfig的js加载器 */
function jsRegisterLoader(filepath: string, content?: string): any {
  return requireModule(filepath);
}

/* 获取配置文件 */
function getSweetConfigFile(sweetOptions: SweetOptions, configFile?: string): SweetConfig {
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
  const errorMsg: string = 'Please configure the .sweetrc.js or sweet.config.js file first.';

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

export default getSweetConfigFile;