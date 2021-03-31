import * as path from 'path';
import * as webpack from 'webpack';
import * as ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type * as Config from 'webpack-chain';
import { dllCache } from '../config/cacheConfig';
import type { SweetConfig, SweetOptions } from '../utils/types';

/* 开发环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { dll, serverRender, frame, hot, hotType = 'react-refresh' }: SweetConfig = sweetConfig;

  // dll
  config
    .when(!!(dll && Array.isArray(dll) && dll.length > 0 && !serverRender), (chainConfig: Config): void => {
      chainConfig
        .plugin('DllReferencePlugin')
        .use(webpack.DllReferencePlugin, [{
          context: sweetOptions.basicPath,
          manifest: require(path.join(sweetOptions.basicPath, dllCache, 'manifest.json'))
        }]);
    });

  // 热替换 webpack5的HotModuleReplacementPlugin插件会生成无用的文件
  config
    .when(!!hot, (chainConfig: Config): void => {
      chainConfig
        .plugin('webpack.HotModuleReplacementPlugin')
        .use(webpack.HotModuleReplacementPlugin);
    });

  // react-refresh-webpack-plugin
  config
    .when(!!hot && frame === 'react' && hotType === 'react-refresh', (chainConfig: Config): void => {
      chainConfig
        .plugin('react-refresh-webpack-plugin')
        .use(ReactRefreshWebpackPlugin, [{
          overlay: {
            entry: require.resolve('@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry'),
            module: require.resolve('@pmmmwh/react-refresh-webpack-plugin/overlay')
          }
        }]);
    });
}