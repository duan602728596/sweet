import * as fs from 'fs';
import * as path from 'path';
import register from '@babel/register';
import * as cosmiconfig from 'cosmiconfig';
import { requireModule } from './utils';
import { SweetConfig, SweetOptions } from './types';

/* 创建cosmiconfig的js加载器 */
function createJsRegisterLoader(sweetOptions: SweetOptions): Function {
  return function jsRegisterLoader(filepath: string, content?: string): any {
    register({
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['node 9']
            },
            debug: false,
            modules: 'commonjs',
            useBuiltIns: false
          }
        ]
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-optional-catch-binding',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-syntax-bigint'
      ],
      cache: true
    });

    return requireModule(filepath);
  };
}

/* 获取配置文件 */
function getSweetConfigFile(sweetOptions: SweetOptions, configFile?: string): SweetConfig {
  const moduleName: string = 'sweet';
  const jsRegisterLoader: Function = createJsRegisterLoader(sweetOptions);
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