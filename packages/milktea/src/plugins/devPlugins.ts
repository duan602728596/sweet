import * as path from 'path';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import { dllCache } from '../config/cacheConfig';
import { SweetConfig, SweetOptions } from '../utils/types';

/* 开发环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const dll: Array<string> | undefined = sweetConfig.dll;
  const serverRender: boolean | undefined = sweetConfig.serverRender;
  const isDll: boolean = !!(dll && Array.isArray(dll) && dll.length > 0 && !serverRender);

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

  // 热替换
  config
    .plugin('webpack.HotModuleReplacementPlugin')
    .use(webpack.HotModuleReplacementPlugin);
}