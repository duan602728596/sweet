import * as fs from 'fs';
import * as path from 'path';
import register from '@babel/register';
import { cosmiconfigSync, LoaderSync } from 'cosmiconfig';
import { CosmiconfigResult, Config } from 'cosmiconfig/dist/types';
import { createBabelPlugins } from '../config/babelConfig';
import { requireModule } from './utils';
import { SweetConfig, SweetOptions, ExplorerSync } from './types';

/* 创建cosmiconfig的js加载器 */
function createJsRegisterLoader(sweetOptions: SweetOptions): LoaderSync {
  return function jsRegisterLoader(filepath: string, content: string): Config | null {
    register({
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['node 10']
            },
            debug: false,
            modules: 'commonjs',
            useBuiltIns: false
          }
        ]
      ],
      plugins: createBabelPlugins(),
      cache: true
    });

    return requireModule(filepath);
  };
}

/* 获取配置文件 */
function configFile(sweetOptions: SweetOptions, configFile?: string): SweetConfig {
  // @babel/register
  const jsRegisterLoader: LoaderSync = createJsRegisterLoader(sweetOptions);

  // 配置文件加载器
  const MODULE_NAME: string = 'sweet';
  const ERROR_MSG: string = 'Please configure the .sweetrc.js or sweet.config.js file first.';

  const explorerSync: ExplorerSync = cosmiconfigSync(MODULE_NAME, {
    searchPlaces: [
      `${ MODULE_NAME }.config.js`,
      `.${ MODULE_NAME }rc.js`
    ],
    loaders: {
      '.js': jsRegisterLoader
    },
    stopDir: sweetOptions.basicPath
  });

  if (typeof configFile === 'string') {
    // 加载其他的配置文件
    let sweetConfigFile: string;

    if (path.isAbsolute(configFile)) {
      sweetConfigFile = configFile;
    } else {
      sweetConfigFile = path.join(sweetOptions.basicPath, configFile);
    }

    if (fs.existsSync(sweetConfigFile)) {
      return jsRegisterLoader(sweetConfigFile, '');
    } else {
      throw new Error(ERROR_MSG);
    }
  } else {
    // 加载默认的配置文件
    const searchResult: CosmiconfigResult = explorerSync.search();

    if (searchResult === null) {
      throw new Error(ERROR_MSG);
    } else {
      return searchResult.config;
    }
  }
}

export default configFile;