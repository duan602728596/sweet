import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import * as HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import * as Config from 'webpack-chain';
import { hardSourceWebpackCache, hardSourceWebpackServerCache, dllCache } from '../config/cacheConfig';
import { SweetConfig, SweetOptions } from '../utils/types';

/* 开发环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * dll { Array<string> }: dll配置
   * serverRender { boolean }: 开启服务器端渲染
   */
  const dll: Array<string> | undefined = sweetConfig.dll;
  const serverRender: boolean | undefined = sweetConfig.serverRender;
  const isDll: boolean = !!(dll && _.isArray(dll) && dll.length > 0 && !serverRender);

  // 缓存
  config
    .plugin('hard-source-webpack-plugin')
    .use(HardSourceWebpackPlugin, [{
      cacheDirectory: path.join(
        sweetOptions.basicPath,
        serverRender ? hardSourceWebpackServerCache : hardSourceWebpackCache
      )
    }]);

  // dll
  config
    .when(isDll,
      (config: Config): void => {
        config
          .plugin('DllReferencePlugin')
          .use(webpack.DllReferencePlugin, [{
            context: sweetOptions.basicPath,
            manifest: require(path.join(sweetOptions.basicPath, dllCache, 'manifest.json'))
          }]);
      }
    );
}