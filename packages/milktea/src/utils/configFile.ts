import * as path from 'node:path';
import { cosmiconfig, Loader } from 'cosmiconfig';
import type { CosmiconfigResult, Config } from 'cosmiconfig/dist/types.js';
import { requireModule, requireCommonjsModule, isFileExists } from '@sweet-milktea/utils';
import type { SweetConfig, SweetOptions, Explorer, Info } from './types.js';

const configFileExtensions: Array<`.${ string }`> = ['.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs', '.jsx'];

/* 创建cosmiconfig的js加载器 */
function createJsRegisterLoader(): Loader {
  return async function jsRegisterLoader(filepath: string, content: string): Promise<Config | null> {
    (await requireModule('@babel/register'))({
      presets: [[
        '@sweet-milktea/babel-preset-sweet',
        {
          env: {
            nodeEnv: true,
            ecmascript: true,
            modules: 'commonjs'
          },
          typescript: {
            use: true
          }
        }
      ]],
      cache: true,
      ignore: [/node_modules/],
      extensions: configFileExtensions
    });

    /**
     * TODO:
     *   加载配置文件仍然使用commonjs的方法，无论是否在esm环境下启动。
     *   如果在esm模式下加载typescript，你需要安装ts-node，然后使用如下方式启动：
     *   `TS_NODE_PROJECT=tsconfig.ts-node.json NODE_OPTIONS="--loader ts-node/esm" milktea-esm start`
     *   具体原因参考ts-node的[issues]：https://github.com/TypeStrong/ts-node/issues/1007
     */
    let modules: Config | null;

    try {
      modules = requireCommonjsModule(filepath);
    } catch (err) {
      console.error(err);
      modules = requireModule(filepath);
    }

    return modules;
  };
}

export type ConfigFile = SweetConfig | ((info: Info) => SweetConfig);
export type GetConfigFileReturn = ConfigFile | { default: ConfigFile };

/* 获取配置文件 */
async function getConfigFile(sweetOptions: SweetOptions, configFile?: string): Promise<GetConfigFileReturn> {
  // @babel/register
  const jsRegisterLoader: Loader = createJsRegisterLoader();

  // 配置文件加载器
  const MODULE_NAME: string = 'sweet';
  const ERROR_MSG: string = 'Please configure the .sweetrc.js or sweet.config.js file first.';
  const explorer: Explorer = cosmiconfig(MODULE_NAME, {
    searchPlaces: configFileExtensions.map((ext: `.${ string }`): [
      `${ string }.config.${ string }`,
      `.${ string }rc.${ string }`,
    ] => [
      `${ MODULE_NAME }.config${ ext }`,
      `.${ MODULE_NAME }rc${ ext }`
    ]).flat(),
    loaders: configFileExtensions.reduce((result: Record<`.${ string }`, Loader>, ext: `.${ string }`): Record<string, Loader> => {
      result[ext] = jsRegisterLoader;

      return result;
    }, {}),
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

    if (await isFileExists(sweetConfigFile)) {
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