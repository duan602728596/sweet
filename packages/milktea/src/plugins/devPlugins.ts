import * as path from 'path';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import { dllCache } from '../config/cacheConfig';
import type { SweetConfig, SweetOptions } from '../utils/types';

/* 开发环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { dll, serverRender, hot }: SweetConfig = sweetConfig;
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

  // 热替换 webpack5的HotModuleReplacementPlugin插件会生成无用的文件
  if (hot) {
    config
      .plugin('webpack.HotModuleReplacementPlugin')
      .use(webpack.HotModuleReplacementPlugin);
  }
}