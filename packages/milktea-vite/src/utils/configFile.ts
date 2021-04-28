import * as fs from 'fs';
import * as path from 'path';
import { cosmiconfig, Loader } from 'cosmiconfig';
import type { CosmiconfigResult, Config } from 'cosmiconfig/dist/types';
import { requireModule, isExists } from './utils';
import type { SweetConfig, SweetOptions, Explorer, Info } from './types';

/* 创建cosmiconfig的js加载器 */
function createJsRegisterLoader(): Loader {
  return async function jsRegisterLoader(filepath: string, content: string): Promise<Config | null> {
    (await requireModule('@babel/register'))({
      presets: [[
        await requireModule('@sweet-milktea/babel-preset-sweet'),
        {
          env: {
            nodeEnv: true,
            modules: 'commonjs'
          },
          typescript: {
            use: true
          }
        }
      ]],
      cache: true,
      ignore: [/node_modules/],
      extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', 'cjs', '.tsx', '.ts']
    });

    return await requireModule(filepath);
  };
}

export type ConfigFile = SweetConfig | ((info: Info) => SweetConfig);

/* 获取配置文件 */
async function getConfigFile(sweetOptions: SweetOptions, configFile?: string): Promise<ConfigFile> {
  // @babel/register
  const jsRegisterLoader: Loader = createJsRegisterLoader();

  // 配置文件加载器
  const MODULE_NAME: string = 'sweet';
  const ERROR_MSG: string = 'Please configure the .sweetrc.js or sweet.config.js file first.';

  const explorer: Explorer = await cosmiconfig(MODULE_NAME, {
    searchPlaces: [
      `${ MODULE_NAME }.config.ts`,
      `${ MODULE_NAME }.config.tsx`,
      `.${ MODULE_NAME }rc.ts`,
      `.${ MODULE_NAME }rc.tsx`,
      `${ MODULE_NAME }.config.js`,
      `.${ MODULE_NAME }rc.js`
    ],
    loaders: {
      '.js': jsRegisterLoader,
      '.ts': jsRegisterLoader,
      '.tsx': jsRegisterLoader
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

    if (await isExists(sweetConfigFile)) {
      return jsRegisterLoader(sweetConfigFile, '');
    } else {
      throw new Error(ERROR_MSG);
    }
  } else {
    // 加载默认的配置文件
    const searchResult: CosmiconfigResult = await explorer.search();

    if (searchResult === null) {
      throw new Error(ERROR_MSG);
    } else {
      return searchResult.config;
    }
  }
}

export default getConfigFile;